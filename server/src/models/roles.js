import mongoose, { Schema, ObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const RoleSchema = new Schema({
    role: { type: String, required: true },
    permissions: {
        type: Array,
        required: true
    }
}, { timestamps: true, versionKey: false }).plugin(mongoosePaginate);

const role = mongoose.model("Roles", RoleSchema);

export default role;