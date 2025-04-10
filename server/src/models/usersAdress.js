import mongoose, { Schema, ObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const usersAddress = mongoose.model("usersAddress",
    new Schema(
        {
            userId: { type: String, required: true },
            default: { type: Boolean, default: false, required: true },
            fullName: { type: String, required: true },
            email: { type: String, require: true },
            phoneNumber: { type: Number, require: true },
            city: {
                label: { type: String, require: true },
                value: { type: String, require: true }
            },
            district: {
                label: { type: String, require: true },
                value: { type: String, require: true }
            },
            ward: {
                label: { type: String, require: true },
                value: { type: String, require: true }
            },
            street: { type: String, require: true }
        },
        {
            versionKey: false,
            timestamps: true,
        }
    ).plugin(mongoosePaginate)
);

export default usersAddress;