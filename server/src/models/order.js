import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const orderSchema = new mongoose.Schema(

  {
    orderCode: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        selectedSize: {
          type: String,
          required: true,
        },
        selectedQuantity: {
          type: Number,
          required: true,
        },
        message: {
          type: String,
          required: false,
        },
        status: {
          type: String,
          enum: [
            "Chờ Xác Nhận",
            "Đã Xác Nhận",
            "Đang Giao Hàng",
            "Giao Hàng Thành Công",
            "Chờ Xác Nhận Thanh Toán",
            "Đã Xác Nhận Thanh Toán",
            "Hủy Đơn Hàng",
            "Yêu Cầu Trả Hàng Hoàn Tiền",
            "Từ Chối Trả Hàng Hoàn Tiền",
            "Xác Nhận Trả Hàng Hoàn Tiền",
            "Đã Nhận Hàng",
            "Yêu Cầu Hủy Đơn Hàng",
            "Từ Chối Hủy Đơn Hàng",
            "Xác Nhận Hủy Đơn Hàng",
            "Hoàn Tiền"
          ],
          default: "Chờ Xác Nhận",
          required: true,
        },
        paymentMethod: {
          type: String,
          required: true,
        },
        reason: {
          type: String,
          default: ""
        },
        data: {
          type: Array,
          default: []
        },
        initNameProduct: {
          type: String
        },
        initPriceProduct: {
          type: Number
        },
        initImageProduct: {
          type: String
        },
        initImportPriceProduct: {
          type: Number
        }
      },
    ],
    transportFee: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true
    }
  },
  { versionKey: false, timestamps: true }
).plugin(mongoosePaginate);

const order = mongoose.model("Order", orderSchema);

export default order;
