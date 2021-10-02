import { Model, model, Schema } from "mongoose";

interface IReview {
  content: string;
  star: number;
  service_id: string;
  user_id: string;
}

interface ReviewModel extends Model<IReview> {
  findAvgStar(): any;
}

const ReviewSchema = new Schema<IReview, ReviewModel>(
  {
    content: {
      type: String,
      requierd: true,
    },
    star: {
      type: Number,
      required: true,
    },
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

ReviewSchema.statics.findAvgStar = function () {
  return this.aggregate([
    {
      $group: {
        _id: "$service_id",
        star: { $avg: "$star" },
      },
    },
  ]);
};
const ReviewModel = model<IReview, ReviewModel>("Review", ReviewSchema);

export default ReviewModel;
