import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
  type Types,
} from "mongoose";

export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingDocument = HydratedDocument<IBooking>;

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Please provide a valid email address.",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Ensure the booking references a real event before persisting it.
bookingSchema.pre("save", async function (this: BookingDocument) {
  if (!this.eventId) {
    throw new Error("eventId is required.");
  }

  const EventModel = mongoose.model("Event");
  const existingEvent = await EventModel.exists({ _id: this.eventId });

  if (!existingEvent) {
    throw new Error("The referenced event does not exist.");
  }

  if (!this.email || this.email.trim().length === 0) {
    throw new Error("Email is required.");
  }

  this.email = this.email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
    throw new Error("Please provide a valid email address.");
  }
});

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);
