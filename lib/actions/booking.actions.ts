"use server";

import { Booking } from "@/database/booking.model";
import connectToDatabase from "@/lib/mongodb";

export const createBooking = async ({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) => {
  try {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return {
        success: false,
        message: "Please provide a valid email address.",
      };
    }

    await connectToDatabase();

    await Booking.create({ eventId, email });

    return { success: true };
  } catch (error) {
    console.error("create booking failed", error);
    return { success: false, message: "Unable to create booking." };
  }
};
