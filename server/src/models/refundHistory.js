import mongoose, { Schema, ObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const refundHistory = mongoose.model("refundHistory",
    new Schema(
        {
            userId: { type: String, required: true },
            orderId: { type: String, required: true },
            amount: { type: Number },
        },
        {
            versionKey: false,
            timestamps: true,
        }
    ).plugin(mongoosePaginate)
);

export default refundHistory;
