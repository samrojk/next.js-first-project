import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Event } from "@/database/event.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // const eventData = await req.json();
    const formData = await req.formData();
    const eventData = Object.fromEntries(formData.entries());

    const createdEvent = await Event.create(eventData);

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Event creation failed:", error);

    return NextResponse.json(
      {
        message: "Event creation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
