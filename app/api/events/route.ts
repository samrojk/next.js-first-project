import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectToDatabase from "@/lib/mongodb";
import { Event } from "@/database/event.model";

// Configure Cloudinary using only CLOUDINARY_URL
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();

    const event = Object.fromEntries(formData.entries());

    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 },
      );
    }

    const tagsRaw = formData.get("tags");
    const agendaRaw = formData.get("agenda");

    if (!tagsRaw || !agendaRaw) {
      return NextResponse.json(
        { message: "Tags and agenda are required" },
        { status: 400 },
      );
    }

    const tags = JSON.parse(String(tagsRaw));
    const agenda = JSON.parse(String(agendaRaw));

    if (!Array.isArray(tags) || !Array.isArray(agenda)) {
      return NextResponse.json(
        { message: "Tags and agenda must be arrays" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Cloudinary config:", {
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key,
      has_api_secret: !!cloudinary.config().api_secret,
    });

    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "DevEvent",
          },
          (error, result) => {
            if (error) {
              console.error("CLOUDINARY UPLOAD ERROR:", error);
              reject(error);
              return;
            }

            if (!result) {
              reject(new Error("Cloudinary returned no result"));
              return;
            }

            console.log("CLOUDINARY UPLOAD SUCCESS:", result.secure_url);

            resolve(result);
          },
        );

        uploadStream.end(buffer);
      },
    );

    const createdEvent = await Event.create({
      ...event,
      image: uploadResult.secure_url,
      tags,
      agenda,
    });

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("EVENT CREATION ERROR:", error);

    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Events fetched successfully",
        events,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("EVENT FETCHING ERROR:", error);

    return NextResponse.json(
      {
        message: "Event fetching failed",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 },
    );
  }
}
