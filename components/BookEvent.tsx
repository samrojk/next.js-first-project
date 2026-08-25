"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await createBooking({ eventId, email });

      if (result.success) {
        setSubmitted(true);
        posthog.capture("event_booked", { eventId, slug, email });
      } else {
        setError(result.message ?? "Unable to create booking.");
      }
    } catch (error) {
      console.error("Booking creation failed", error);
      setError("Unable to create booking. Please try again.");
      posthog.captureException(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
            />
          </div>
          {error && <p role="alert">{error}</p>}

          <button
            type="submit"
            className="button-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};
export default BookEvent;
