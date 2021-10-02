import { model, Schema } from "mongoose";

interface ILike {
  service_id: string;
  user_id: string;
}

const LikeSchema = new Schema<ILike>(
  {
    service_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const LikeModel = model<ILike>("Like", LikeSchema);

export default LikeModel;
