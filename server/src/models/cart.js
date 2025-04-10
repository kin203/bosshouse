import mongoose, { Schema } from "mongoose";

const cart = mongoose.model('Carts', new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    carts: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            selectedSize: { type: String, required: true },
            selectedQuantity: { type: Number, required: true },
        }
    ]
}, { versionKey: false, timestamps: true }))

export default cart
