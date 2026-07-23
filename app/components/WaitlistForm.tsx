"use client";

import { WAITLIST_SUCCESS_MESSAGE } from "@/lib/site";
import { sendGAEvent } from "@next/third-parties/google";
import { useState } from "react";

interface WaitlistFormProps {
  /** Where on the page this form lives — shows up in GA as the `location` param. */
  location: string;
  className?: string;
}

export default function WaitlistForm({ location, className }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: location }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Something went wrong");
      }

      sendGAEvent("event", "waitlist_signup", { location, email_domain: email.split("@")[1] ?? "" });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  return (
    <div className={`flex flex-col items-center gap-2 w-full ${className ?? ""}`}>
      {status === "success" ? (
        <p className="font-mono text-[14.5px] text-accent text-center max-w-[42ch]">
          {WAITLIST_SUCCESS_MESSAGE}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row sm:items-end gap-[10px] w-full max-w-[520px]"
        >
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <label
              htmlFor={`waitlist-email-${location}`}
              className="font-mono text-[13.5px] text-ink-dim text-left"
            >
              Join the waitlist
            </label>
            <input
              id={`waitlist-email-${location}`}
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={status === "loading"}
              className="font-mono text-[14.5px] w-full px-5 py-[14px] rounded-[11px] border border-line2 bg-white/[0.03] text-ink placeholder:text-ink-faint focus:outline-none focus:border-white/[0.22] transition-colors duration-200 disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="font-mono text-[14.5px] font-semibold inline-flex items-center justify-center gap-[9px] px-6 py-[14px] rounded-[11px] cursor-pointer border border-transparent bg-accent text-[#06140b] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_60%,transparent),0_8px_30px_-10px_color-mix(in_oklab,var(--accent)_60%,transparent)] hover:-translate-y-px transition-transform duration-[120ms] whitespace-nowrap disabled:opacity-60 disabled:hover:translate-y-0 sm:shrink-0"
          >
            {status === "loading" ? "Submitting…" : "Submit"}
          </button>
        </form>
      )}
      {status === "error" && errorMessage ? (
        <p className="font-mono text-[12.5px] text-red-400 text-center max-w-[480px]">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
