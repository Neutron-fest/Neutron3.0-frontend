"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth-layout";
import { AuthButton } from "@/components/auth-components";
import { motion } from "framer-motion";

type SearchParamsLike = { get: (key: string) => string | null };

const getFirstParam = (searchParams: SearchParamsLike | null, keys: string[]) => {
  if (!searchParams) return null;
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) return value;
  }
  return null;
};

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const message = getFirstParam(searchParams, ["message", "msg", "successMessage", "statusMessage"]);
  const orderId = getFirstParam(searchParams, ["orderId", "order_id", "order", "reference", "ref"]);
  const paymentId = getFirstParam(searchParams, ["paymentId", "payment_id", "paymentIntent", "payment_intent", "id"]);
  const transactionId = getFirstParam(searchParams, ["transactionId", "transaction_id", "txnId", "txnid"]);
  const amount = getFirstParam(searchParams, ["amount", "total", "value"]);
  const currency = getFirstParam(searchParams, ["currency", "curr"]);

  const formattedAmount = amount
    ? `${currency ? currency.toUpperCase() + " " : ""}${amount}`
    : null;

  const details: Array<{ label: string; value: string }> = [
    orderId ? { label: "Order ID", value: orderId } : null,
    paymentId ? { label: "Payment ID", value: paymentId } : null,
    transactionId ? { label: "Transaction ID", value: transactionId } : null,
    formattedAmount ? { label: "Amount", value: formattedAmount } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <AuthLayout
      title="Payment Successful"
      subtitle="We’ve received your payment. Thank you!"
    >
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 py-6"
        >
          <div className="w-20 h-20 bg-green-900/20 text-green-500/80 rounded-full flex items-center justify-center mx-auto mb-2 relative">
            <div className="absolute inset-0 bg-green-900/20 blur-xl rounded-full animate-pulse" />
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 4L12 14.01l-3-3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-3">Payment Confirmed</h2>
            <p className="text-white/60 leading-relaxed font-light max-w-md mx-auto">
              {message || "Your payment was processed successfully. You can continue from here."}
            </p>
          </div>

          {details.length > 0 && (
            <div className="max-w-md mx-auto p-4 bg-white/5 border border-white/10 rounded-2xl text-left space-y-3">
              {details.map((d) => (
                <div key={d.label} className="flex items-center justify-between gap-4">
                  <span className="text-white/50 text-sm">{d.label}</span>
                  <span className="text-white/80 font-medium text-sm break-all">{d.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-md mx-auto">
            <Link href="/profile">
              <AuthButton variant="primary">Go to Profile</AuthButton>
            </Link>
            <Link href="/">
              <AuthButton variant="outline">Back to Home</AuthButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
}
