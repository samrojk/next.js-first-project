"use client";

import { useState } from "react";

const BookEvent = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form action="">
          <div>
            <label htmlFor="Email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="Email"
              name="Email"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="button-submit"
            onClick={() => setSubmitted(true)}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
