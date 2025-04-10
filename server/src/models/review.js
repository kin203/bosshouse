import mongoose, { Schema, ObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ReviewSchema = new Schema({
    productId: { type: String, required: true, ref: "Products" },
    userId: { type: String, required: true, ref: "Users" },
    selectedSize: { type: String, required: true },
    selectedQuantity: { type: Number, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    images: { type: Array },
    orderId: { type: String },
}, { timestamps: true, versionKey: false }).plugin(mongoosePaginate);

const review = mongoose.model("Review", ReviewSchema);

export default review;