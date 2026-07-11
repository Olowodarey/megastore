"use client";

import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useVerifyPaymentMutation } from "../../../_services/authApi";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
const PAYSTACK_CURRENCY = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY ?? "NGN";

interface PaystackPayButtonProps {
  orderId: string;
  total: number;
  email: string;
}

const PaystackPayButton = ({ orderId, total, email }: PaystackPayButtonProps) => {
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();

  const initializePayment = usePaystackPayment({
    publicKey: PAYSTACK_PUBLIC_KEY,
    email,
    amount: Math.round(total * 100),
    currency: PAYSTACK_CURRENCY,
  });

  const handlePayNow = () => {
    initializePayment({
      config: {
        email,
        amount: Math.round(total * 100),
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
  };

  return (
    <Button type="button" className="gap-2" onClick={handlePayNow} disabled={isVerifying}>
      {isVerifying ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4" /> Pay ${total.toFixed(2)} with Paystack
        </>
      )}
    </Button>
  );
};

export default PaystackPayButton;
