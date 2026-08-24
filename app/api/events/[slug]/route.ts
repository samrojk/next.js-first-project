import { NextResponse } from "next/server";
import { Event } from "@/database/event.model";
import connectToDatabase from "@/lib/mongodb";

type EventRouteContext = {
  params: Promise<{ slug: string }>;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(_request: Request, { params }: EventRouteContext) {
  try {
    const { slug } = await params;

    // Reject malformed values before connecting to the database.
    if (
      typeof slug !== "string" ||
      slug.length === 0 ||
      slug.length > 100 ||
      !SLUG_PATTERN.test(slug)
    ) {
      return NextResponse.json(
        { message: "A valid event slug is required." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      return NextResponse.json(
        { message: "Event not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("EVENT FETCH BY SLUG ERROR:", error);

    return NextResponse.json(
      { message: "Unable to fetch the event." },
      { status: 500 },
    );
  }
}
