import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import connectToDatabase from "@/lib/mongodb";
import { Event } from "@/database/event.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Accepts JSON only -------
    // const eventData = await req.json();

    // Accepts form data only -------
    const formData = await req.formData();
    const eventData = Object.fromEntries(formData.entries());

    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Image file is required." },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          },
        )
        .end(buffer);
    });

    // event.image = (uploadResult as { secure_url: string }).secure_url;
    eventData.image = (uploadResult as { secure_url: string }).secure_url;

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
        // error: error instanceof Error ? error.message : "Unknown error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
