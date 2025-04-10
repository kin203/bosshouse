import mongoose, { Schema } from "mongoose";

const voucherSchema = new Schema({
    codeId: { type: String },
    code: { type: String },
    apply: { type: Boolean, default: false },
    expirationDate: {type: Array},
    isActive: { type: Boolean },
    maxDiscount: { type: Number },
    maximum: { type: Number },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    discountPercent: { type: Number },
});

const usersVoucher = mongoose.model(
    "UsersVoucher",
    new Schema(
        {
            userId: { type: String, required: true },
            codes: [voucherSchema],
        },
        {
            versionKey: false,
            timestamps: true,
        }
    )
);

export default usersVoucher;