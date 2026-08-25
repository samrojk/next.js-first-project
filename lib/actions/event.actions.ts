"use server";

import { Event } from "@/database/event.model";
import connectToDatabase from "@/lib/mongodb";
import { cacheLife } from "next/cache";

export const getEvents = async () => {
  "use cache";
  cacheLife("hours");

  try {
    await connectToDatabase();

    const events = await Event.find().sort({ createdAt: -1 }).lean();

    return events.map((event) => ({
      ...event,
      _id: event._id.toString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("EVENT FETCHING ERROR:", error);
    return [];
  }
};

export const getEventBySlug = async (slug: string) => {
  "use cache";
  cacheLife("hours");

  try {
    await connectToDatabase();

    const event = await Event.findOne({ slug }).lean();

    if (!event) return null;

    return {
      ...event,
      _id: event._id.toString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("EVENT FETCH BY SLUG ERROR:", error);
    return null;
  }
};

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectToDatabase();

    const event = await Event.findOne({ slug });

    if (!event) return [];

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();

    return similarEvents.map((event) => ({
      ...event,
      _id: event._id.toString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));
  } catch {
    return [];
  }
};
