import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const voucher = mongoose.model(
  "Voucher",
  new Schema(
    {
      code: { type: String, required: true },
      discountPercent: { type: Number, required: true },
      maxDiscount: { type: Number, required: true },
      expirationDate: { type: Array, required: true },
      isActive: { type: Boolean, required: true, default: true },
      maximum: {type: Number, required: true}
    },
    {
      versionKey: false,
      timestamps: true,
    }
  ).plugin(mongoosePaginate)
);

export default voucher;