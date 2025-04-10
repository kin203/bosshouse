
import Joi from "joi";

const schemaActive = Joi.object({
    _id : Joi.string().required(),
    isActive: Joi.boolean().required(),
});
export default schemaActive