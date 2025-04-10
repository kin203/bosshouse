import mongoose, { Schema, ObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const user = mongoose.model(
    "Users",
    new mongoose.Schema(
        {
            username: {
                type: String,
                require: true,
                default: 'Khách Hàng'
            },
            avatar: {
                type: String,
                default: 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg'
            },
            email: {
                type: String,
                require: true
            },
            password: {
                type: String,
                require: true,
            },
            phoneNumber: {
                type: Number
            },
            address: {
                type: String,
                default: 'Chưa cập nhật'
            },
            roleId: {
                type: String,
                required: true,
                default: "guest",
            },
            cardId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Carts',
                require: true
            }
        },
        { versionKey: false }
    ).plugin(mongoosePaginate)
);

export default user;