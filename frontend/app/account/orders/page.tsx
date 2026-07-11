"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "../../_lib/hooks";
import { useGetOrdersQuery } from "../../_services/authApi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  PROCESSING: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  SHIPPED: "bg-violet-500/15 text-violet-600 border-violet-500/30",
  DELIVERED: "bg-green-500/15 text-green-600 border-green-500/30",
  CANCELLED: "bg-red-500/15 text-red-600 border-red-500/30",
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, token, hasHydrated } = useAppSelector((s) => s.auth);
  const { data: orders, isLoading } = useGetOrdersQuery(undefined, { skip: !token });

  useEffect(() => {
    if (hasHydrated && !token) router.push("/login");
  }, [hasHydrated, token, router]);

  if (!hasHydrated || !user) {
    return (
      <div className="min-h-screen bg-background max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
            <p className="text-muted-foreground mt-1">Hello, {user.name ?? user.email}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
        )}

        {!isLoading && orders?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Package className="h-16 w-16 text-muted-foreground/40" />
            <p className="text-lg font-medium text-muted-foreground">No orders yet</p>
            <Button asChild><Link href="/">Start Shopping</Link></Button>
          </div>
        )}

        <div className="space-y-4">
          {orders?.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}>
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-muted-foreground font-mono mb-1">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-lg font-bold text-primary">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {order.items.slice(0, 4).map((item) => (
                    <div key={item.id} className="relative shrink-0 w-14 h-14 rounded-lg bg-muted/40 border border-border overflow-hidden">
                      <Image src={item.product.thumbnail} alt={item.product.title} fill sizes="56px" className="object-contain p-1" />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="shrink-0 w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
