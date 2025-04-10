import mongoose, { Schema, ObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const blog = mongoose.model("Blogs",
    new Schema(
        {
            title: { type: String, required: true },
            content: { type: String, required: true },
            author: { type: String },
            imageTitle: { type: String, require: true }
            // created_at: { type: Date, default: Date.now },
            // updated_at: { type: Date, default: Date.now }
        },
        {
            versionKey: false,
            timestamps: true,
        }
    ).plugin(mongoosePaginate)
);

export default blog;
