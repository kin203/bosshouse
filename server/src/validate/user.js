import Joi from "joi";
import { customMessages } from "../utils/validate.js";

const userSignup = Joi.object({
    username: Joi.string().min(3).max(25).messages(customMessages),
    email: Joi.string().email().messages(customMessages),
    password: Joi.string().min(6).max(20).messages(customMessages),
    confirmPassword: Joi.string().valid(Joi.ref("password")).messages(customMessages),
    role: Joi.string().messages(customMessages)
})

const userSignin = Joi.object({
    email: Joi.string().email().messages(customMessages),
    password: Joi.string().min(6).max(20).messages(customMessages),
})

const userSchema = Joi.object({
    _id: Joi.string().messages(customMessages),
    username: Joi.string().min(3).max(25).required().messages(customMessages),
    email: Joi.string().email().messages(customMessages),
    password: Joi.string().min(6).max(20).messages(customMessages),
    address: Joi.string().messages(customMessages),
    avatar: Joi.string().messages(customMessages),
    phoneNumber: Joi.number().messages(customMessages),
    roleId: Joi.string().messages(customMessages)
})

export { userSignin, userSignup, userSchema }