import Joi from "joi";
import { customMessages } from "../utils/validate.js";

const schema = Joi.object({
  productId: Joi.string().required().messages(customMessages),
  userId: Joi.string().messages(customMessages),
  rating: Joi.number().messages(customMessages),
  comment: Joi.string().messages(customMessages),
  selectedSize: Joi.string().messages(customMessages),
  selectedQuantity: Joi.number().messages(customMessages),
  images: Joi.array().messages(customMessages),
  orderId: Joi.string().messages(customMessages),
});

export default schema;
