"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector } from "../../../_lib/hooks";
import { useGetOrderQuery, useVerifyPaymentMutation } from "../../../_services/authApi";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, CheckCircle2, Clock, Truck, Package, XCircle, CreditCard, Loader2 } from "lucide-react";

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
const PAYSTACK_CURRENCY = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY ?? "NGN";

const STEPS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

const STEP_ICONS = {
  PENDING: Clock,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle2,
  CANCELLED: XCircle,
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-500",
  PROCESSING: "text-blue-500",
  SHIPPED: "text-violet-500",
  DELIVERED: "text-green-500",
  CANCELLED: "text-red-500",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useAppSelector((s) => s.auth);
  const { data: order, isLoading, error } = useGetOrderQuery(id as string, { skip: !token });
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  const initializePayment = usePaystackPayment({
    publicKey: PAYSTACK_PUBLIC_KEY,
    email: user?.email ?? "",
    amount: order ? Math.round(order.total * 100) : 0,
    currency: PAYSTACK_CURRENCY,
  });

  const handlePayNow = () => {
    if (!order || !user) return;
    initializePayment({
      config: {
        email: user.email,
        amount: Math.round(order.total * 100),
        currency: PAYSTACK_CURRENCY,
        reference: `${order.id}_${Date.now()}`,
      },
      onSuccess: async (response) => {
        try {
          await verifyPayment({ orderId: order.id, reference: response.reference }).unwrap();
          toast.success("Payment successful!");
        } catch {
          toast.error("Payment could not be verified. Please contact support.");
        }
      },
      onClose: () => {
        toast.info("Payment was not completed.");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background max-w-3xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive font-medium">Order not found.</p>
      </div>
    );
  }

  const isCancelled = order.status === "CANCELLED";
  const currentStep = STEPS.indexOf(order.status as typeof STEPS[number]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Button variant="ghost" className="mb-6 -ml-2" asChild>
          <Link href="/account/orders"><ChevronLeft className="h-4 w-4 mr-1" />Back to Orders</Link>
        </Button>

        <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order #{order.id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <span className={`text-base font-bold ${STATUS_COLORS[order.status]}`}>{order.status}</span>
        </div>

        {/* Payment */}
        <Card className="p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-1">Payment</h2>
            {order.paymentStatus === "PAID" ? (
              <p className="text-sm text-green-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Paid
                {order.paidAt && ` on ${new Date(order.paidAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
              </p>
            ) : order.paymentStatus === "FAILED" ? (
              <p className="text-sm text-destructive flex items-center gap-1.5">
                <XCircle className="h-4 w-4" /> Payment failed — please try again
              </p>
            ) : (
              <p className="text-sm text-yellow-600 flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Awaiting payment
              </p>
            )}
          </div>

          {order.paymentStatus !== "PAID" && (
            <Button type="button" className="gap-2" onClick={handlePayNow} disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" /> Pay ${order.total.toFixed(2)} with Paystack
                </>
              )}
            </Button>
          )}
        </Card>

        {/* Tracking progress */}
        {!isCancelled && (
          <Card className="p-6 mb-6">
            <h2 className="text-sm font-semibold text-foreground mb-6">Order Tracking</h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-muted mx-8" />
              <div
                className="absolute left-0 top-5 h-0.5 bg-primary mx-8 transition-all duration-500"
                style={{ right: `${100 - (currentStep / (STEPS.length - 1)) * 100}%` }}
              />
              {STEPS.map((step, i) => {
                const Icon = STEP_ICONS[step];
                const done = i <= currentStep;
                return (
                  <div key={step} className="flex flex-col items-center gap-2 z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${done ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted text-muted-foreground"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`text-xs font-medium text-center ${done ? "text-primary" : "text-muted-foreground"}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Items */}
        <Card className="p-6 mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Items ({order.items.length})</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id}>
                <div className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-lg bg-muted/40 border border-border overflow-hidden shrink-0">
                    <Image src={item.product.thumbnail} alt={item.product.title} fill sizes="64px" className="object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.id}`} className="text-sm font-medium text-foreground hover:text-primary line-clamp-2">
                      {item.product.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground shrink-0">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium text-muted-foreground">Order Total</span>
            <span className="text-xl font-bold text-primary">${order.total.toFixed(2)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
