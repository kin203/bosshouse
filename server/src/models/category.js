import mongoose, { Schema, ObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const category = mongoose.model('Category',
    new Schema({
        name: { type: String, required: true, default: 'unCategorized' },
        slug: { type: String, required: true, default: 'unCategorized' },
        products: [
            {
                type: ObjectId,
                ref: 'Products'
            }
        ]
    }, {
        versionKey: false,
        timestamps: true
    }).plugin(mongoosePaginate)
)

export default category 