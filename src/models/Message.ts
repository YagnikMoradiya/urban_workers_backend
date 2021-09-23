import { model, Schema, Types } from "mongoose";

interface Message {
  conversationId: string;
  senderId: string;
  text: string;
}

const messageSchema = new Schema<Message>(
  {
    conversationId: {
      type: Types.ObjectId,
    },
    senderId: {
      type: Types.ObjectId,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MessageModel = model<Message>("Message", messageSchema);

export default MessageModel;
