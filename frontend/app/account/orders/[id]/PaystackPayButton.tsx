"use client";

import { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useInitializePaymentMutation, useVerifyPaymentMutation } from "../../../_services/authApi";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
const PAYSTACK_CURRENCY = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY ?? "NGN";

interface PaystackPayButtonProps {
  orderId: string;
  total: number;
  email: string;
}

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const PaystackPayButton = ({ orderId, total, email }: PaystackPayButtonProps) => {
  const [initOrderPayment, { isLoading: isPreparing }] = useInitializePaymentMutation();
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
  const [conversion, setConversion] = useState<{ amountKobo: number; rate: number } | null>(null);

  // Fetch a fresh USD→NGN conversion as soon as the button mounts, so the
  // Naira amount is visible to the user before they even click Pay.
  useEffect(() => {
    initOrderPayment(orderId)
      .unwrap()
      .then(({ amountKobo, rate }) => setConversion({ amountKobo, rate }))
      .catch(() => {
        /* silently ignore; handlePayNow will retry and surface an error */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const initializePaystackPopup = usePaystackPayment({
    publicKey: PAYSTACK_PUBLIC_KEY,
    email,
    amount: conversion?.amountKobo ?? 0,
    currency: PAYSTACK_CURRENCY,
  });

  const handlePayNow = async () => {
    try {
      const { amountKobo } = conversion ?? (await initOrderPayment(orderId).unwrap());
      initializePaystackPopup({
        config: {
          email,
          amount: amountKobo,
          currency: PAYSTACK_CURRENCY,
          reference: `${orderId}_${Date.now()}`,
        },
        onSuccess: async (response) => {
          try {
            await verifyPayment({ orderId, reference: response.reference }).unwrap();
            toast.success("Payment successful!");
          } catch {
            toast.error("Payment could not be verified. Please contact support.");
          }
        },
        onClose: () => {
          toast.info("Payment was not completed.");
        },
      });
    } catch {
      toast.error("Could not start payment. Please try again.");
    }
  };

  const isLoading = isPreparing || isVerifying;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button type="button" className="gap-2" onClick={handlePayNow} disabled={isLoading}>
        {isVerifying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
          </>
        ) : isPreparing && !conversion ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Preparing…
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" /> Pay ${total.toFixed(2)} with Paystack
          </>
        )}
      </Button>
      {conversion && (
        <p className="text-xs text-muted-foreground">
          ≈ {nairaFormatter.format(conversion.amountKobo / 100)} at ₦{conversion.rate.toFixed(2)}/$1
        </p>
      )}
    </div>
  );
};

export default PaystackPayButton;
