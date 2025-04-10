import mongoose, { Schema, ObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const notification = mongoose.model("Notification",
    new Schema(
        {
            title: { type: String, required: true },
            content: { type: String, required: true },
            to: { type: String, required: true },
            userId: { type: String },
            username: { type: String },
            isRead: { type: Boolean, require: true, default: false }
        },
        {
            versionKey: false,
            timestamps: true,
        }
    ).plugin(mongoosePaginate)
);

export default notification;
