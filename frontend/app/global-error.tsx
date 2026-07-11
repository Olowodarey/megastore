"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "sans-serif",
          background: "#0f172a",
          color: "#f1f5f9",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Something went wrong
        </h2>
        <p style={{ color: "#94a3b8" }}>{error.message}</p>
        <button
          onClick={reset}
          style={{
            padding: "0.5rem 1.5rem",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
