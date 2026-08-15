import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventDocument = HydratedDocument<IEvent>;

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "event";

const normalizeDate = (value: string): string => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Event date is invalid.");
  }

  return parsed.toISOString().split("T")[0];
};

const normalizeTime = (value: string): string => {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])?$/);

  if (!match) {
    throw new Error(
      "Event time must be in a valid format such as 18:30 or 6:30 PM.",
    );
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const meridiem = match[3]?.toLowerCase();

  if (minutes < 0 || minutes > 59) {
    throw new Error("Event minutes must be between 00 and 59.");
  }

  let normalizedHours = hours;

  if (meridiem) {
    if (hours < 1 || hours > 12) {
      throw new Error("Time in AM/PM format must use hours between 1 and 12.");
    }

    normalizedHours = hours % 12;

    if (meridiem === "pm") {
      normalizedHours += 12;
    }
  } else if (hours < 0 || hours > 23) {
    throw new Error("Event time must be between 00:00 and 23:59.");
  }

  return `${String(normalizedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const ensureNonEmptyString = (
  value: string | undefined,
  fieldName: string,
): void => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} is required and cannot be empty.`);
  }
};

const ensureNonEmptyArray = (
  value: string[] | undefined,
  fieldName: string,
): void => {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => typeof item !== "string" || item.trim().length === 0)
  ) {
    throw new Error(`${fieldName} must contain at least one non-empty value.`);
  }
};

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean => value.length > 0,
        message: "Agenda must contain at least one item.",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean => value.length > 0,
        message: "Tags must contain at least one item.",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Generate a stable, URL-safe slug from the title before Mongoose validates required fields.
eventSchema.pre("validate", function (this: EventDocument) {
  ensureNonEmptyString(this.title, "Title");
  ensureNonEmptyString(this.description, "Description");
  ensureNonEmptyString(this.overview, "Overview");
  ensureNonEmptyString(this.image, "Image");
  ensureNonEmptyString(this.venue, "Venue");
  ensureNonEmptyString(this.location, "Location");
  ensureNonEmptyString(this.date, "Date");
  ensureNonEmptyString(this.time, "Time");
  ensureNonEmptyString(this.mode, "Mode");
  ensureNonEmptyString(this.audience, "Audience");
  ensureNonEmptyString(this.organizer, "Organizer");

  ensureNonEmptyArray(this.agenda, "Agenda");
  ensureNonEmptyArray(this.tags, "Tags");

  this.title = this.title.trim();
  this.slug =
    this.isModified("title") || this.isNew ? slugify(this.title) : this.slug;
  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
});

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
