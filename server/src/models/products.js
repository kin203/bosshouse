import mongoose, { Schema, ObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const SizePriceSchema = new Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  importPrice: { type: Number },
});

const product = mongoose.model(
  "Products",
  new Schema(
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      images: { type: Array, required: true },
      isActive: { type: Boolean, required: true, default: true },
      sizes: [SizePriceSchema],
      categoryId: {
        type: ObjectId,
        // required: true,
        default: "unCategories",
        ref: "Category",
      },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  ).plugin(mongoosePaginate)
);

export default product;
