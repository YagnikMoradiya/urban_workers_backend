import { model, Schema, Types } from "mongoose";

interface Conversation {
  members: [string];
  lastMessage: string;
}

const conversationSchema = new Schema(
  {
    members: {
      type: Array,
      required: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { strict: false, timestamps: true }
);

const ConversationModel = model("Conversation", conversationSchema);

export default ConversationModel;
