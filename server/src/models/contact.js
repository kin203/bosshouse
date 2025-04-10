import mongoose, { Schema, ObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const contact = mongoose.model('Contact',
    new Schema({
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: Number, required: true },
        content: { type: String, required: true },
        IsProcessed: { type: String, default: "Chờ Phản Hồi" }
    }, {
        versionKey: false,
        timestamps: true
    }).plugin(mongoosePaginate)
)

export default contact 