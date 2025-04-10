import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SoldProductSchema = new Schema({
    productId: { type: mongoose.Types.ObjectId, ref: 'Products', required: true },
    quantitySold: { type: Number, default: 0 }
}, { versionKey: false, timestamps: true });

const soldProduct = mongoose.model('SoldProduct', SoldProductSchema);

export default soldProduct;
