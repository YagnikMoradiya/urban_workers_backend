import { model, Schema } from "mongoose";

interface Worker {
  name: string;
  avatar: string;
  phone: string;
  experience: number;
  location: { type: {}; coordinates: {} };
}

const requiredString = {
  type: String,
  required: true,
};

const workerSchema = new Schema<Worker>({
  name: requiredString,
  avatar: String,
  phone: requiredString,
  experience: {
    type: Number,
    required: true,
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
    },
  },
});

const WorkerModel = model<Worker>("Worker", workerSchema);

export default WorkerModel;
