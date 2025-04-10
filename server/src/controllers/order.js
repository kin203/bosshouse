import order from "../models/order.js";
import { product } from "../models/index.js";

export const getAllOrder = async (req, res) => {
  try {
    const {
      _limit = 10,
      _page = 1,
      _order = "asc",
      _sort = "createdAt",
    } = req.query;

    const options = {
      page: _page,
      limit: _limit,
      order: _order,
      sort: {
        [_sort]: _order === "asc" ? 1 : -1,
      },
    };

    // const orders = await order.find({});
    const orders = await order.paginate({}, options);
    // console.log(orders.docs)


    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllOrderNoPaginate = async (req, res) => {
  try {
    const orders = await order.find({});
    if (!orders) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng!" });
    }

    // Tạo mảng mới để lưu trữ thông tin chi tiết sản phẩm
    const newOrders = await Promise.all(orders.map(async (order) => {
      const products = await Promise.all(order.products.map(async (productInfo) => {
        // Lấy thông tin chi tiết của sản phẩm từ database
        const product1 = await product.findById(productInfo.productId).exec();

        if (!product1) {
          // Nếu không tồn tại, trả về productInfo ban đầu
          return productInfo;
        }

        // Trả về thông tin sản phẩm kèm theo các trường thông tin khác
        return {
          ...product1?.toObject(),
          productId: product1._id,
          name: product1.name,
          imageProduct: product1?.images[0]?.response?.urls[0],
          images: product1?.images,
          sizes: product1.sizes,
          //Thêm các trường thông tin sản phẩm khác cần thiết
          ...productInfo.toObject(),
          selectedSize: productInfo.selectedSize,
          selectedQuantity: productInfo.selectedQuantity,
          message: productInfo.message,
          status: productInfo.status,
          paymentMethod: productInfo.paymentMethod,
          _id: productInfo._id,
        };
      }));

      return {
        ...order?.toObject(),
        products: products,
      };
    }));

    // Sắp xếp lại mảng newOrders theo sản phẩm mới nhất lên đầu
    newOrders.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json(newOrders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orders = await order.findById(req.params.id);
    if (!orders) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng!" });
    }

    const newOrder = await Promise.all(orders.products.map(async (item) => {
      const productItem = await product.findOne({ _id: item.productId });

      return {
        ...item?.toObject(),
        ...productItem?.toObject(),
        selectedSize: item.selectedSize,
        selectedQuantity: item.selectedQuantity,
      };
    }));

    return res.status(200).json({
      ...orders?.toObject(),
      products: newOrder
    });

    // return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getOrderByOrderCode = async (req, res) => {
  try {
    const orders = await order.findOne({ orderCode: req.body.orderCode });
    if (!orders) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng!" });
    }

    const newOrder = await Promise.all(orders.products.map(async (item) => {
      const productItem = await product.findOne({ _id: item.productId });

      return {
        ...item?.toObject(),
        ...productItem?.toObject(),
        selectedSize: item.selectedSize,
        selectedQuantity: item.selectedQuantity,
      };
    }));

    return res.status(200).json({
      ...orders?.toObject(),
      products: newOrder
    });

    // return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllOrderByUserId = async (req, res) => {
  try {
    const data = await order.find({ userId: req.body.userId }).exec();

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách đơn hàng của người dùng!",
      });
    }

    // Tạo mảng mới để lưu trữ thông tin chi tiết sản phẩm
    const newOrders = await Promise.all(data.map(async (order) => {
      const products = await Promise.all(order.products.map(async (productInfo) => {
        // Lấy thông tin chi tiết của sản phẩm từ database
        const product1 = await product.findById(productInfo.productId).exec();

        if (!product1) {
          // Nếu không tồn tại, trả về productInfo ban đầu
          return productInfo;
        }

        // Trả về thông tin sản phẩm kèm theo các trường thông tin khác
        return {
          productId: product1._id,
          name: product1.name,
          imageProduct: product1?.images[0]?.response?.urls[0],
          sizes: product1.sizes,
          //Thêm các trường thông tin sản phẩm khác cần thiết
          selectedSize: productInfo.selectedSize,
          selectedQuantity: productInfo.selectedQuantity,
          message: productInfo.message,
          status: productInfo.status,
          paymentMethod: productInfo.paymentMethod,
          _id: productInfo._id,
          ...productInfo.toObject()
        };
      }));

      // Trả về đơn hàng với thông tin sản phẩm được cập nhật
      return {
        ...order?.toObject(),
        products: products,
      };
    }));

    return res.status(200).json(newOrders);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addOrder = async (req, res) => {
  try {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `#${timestamp}${random}`;
    const { userId, products, fullName, phoneNumber, address, transportFee, totalPrice, email, salePrice } = req.body;

    // Kiểm tra đồng bộ để tránh tình trạng race condition
    // const userOrder = await order.findOne({ userId });

    // Nếu không tìm user, tạo mới order
    // if (!userOrder) {
    const newOrder = await order.create({
      orderCode,
      userId,
      fullName,
      email,
      address,
      phoneNumber,
      products: products.map((p) => {
        return {
          productId: p.productId,
          selectedSize: p.selectedSize,
          selectedQuantity: p.selectedQuantity,
          message: p.message,
          dateTime: p.dateTime,
          paymentMethod: p.paymentMethod,
          ...p
        }
      }),
      transportFee,
      totalPrice,
      salePrice

    });
    // console.log(newOrder)

    if (!newOrder) {
      return res.status(500).json({ message: "Tạo mới đơn hàng thất bại!" });
    }

    return res
      .status(200)
      .json({ message: "Thêm sản phẩm vào order thành công!", newOrder });
    // }

    // Nếu đã có đơn hàng, thêm từng sản phẩm vào đơn hàng hiện tại
    // products.forEach((p) => {
    //   userOrder.products.unshift({
    //     productId: p.productId,
    //     name: p.name,
    //     price: p.price,
    //     quantity: p.quantity,
    //     dateTime: p.dateTime,
    //     paymentMethod: p.paymentMethod,
    //   });
    // });

    // Lưu lại đơn hàng đã cập nhật
    // await userOrder.save();

    // return res
    //   .status(200)
    //   .json({ message: "Thêm sản phẩm vào order thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId, status, products, reason, data } = req.body;

    // Tìm kiếm đơn hàng của người dùng
    const userOrder = await order.findOne({ _id: orderId });

    if (!userOrder) {
      return res.status(404).json({ error: "Đơn hàng của người dùng không tồn tại!" });
    }

    // Cập nhật trạng thái của tất cả các sản phẩm trong đơn hàng
    userOrder.products.forEach(product => {
      product.status = status;
      product.reason = reason;
      product.data = data
    });

    if (status == 'Hủy Đơn Hàng' || status == 'Xác Nhận Hủy Đơn Hàng'
      || status == 'Xác Nhận Trả Hàng Hoàn Tiền') {
      for (const p of products) {
        // Tìm sản phẩm trong đơn hàng
        const listProduct = await product.findOne({ _id: p.productId });
        // console.log(listProduct)

        if (!listProduct) {
          // Nếu không thấy id thì thêm lại vào sản phẩm
          const dataAddProduct = {
            name: p.initNameProduct,
            description: p.initNameProduct,
            images: [{
              response: {
                urls: [p.initImageProduct]
              }
            }],
            sizes: [{ size: p.selectedSize, importPrice: p.initImportPriceProduct, price: p.initPriceProduct, quantity: p.selectedQuantity }],
          }
          // console.log(dataAddProduct)
          product.create(dataAddProduct)
        } else {

          const indexSize = listProduct.sizes.findIndex(s => s.size == p.selectedSize);

          if (indexSize === -1) {
            return res.status(404).json({ error: `Không tìm thấy kích thước sản phẩm ${p.selectedSize}!` });
          }

          // Cập nhật số lượng sản phẩm khi bị hủy hàng
          listProduct.sizes[indexSize].quantity += p.selectedQuantity;

          await listProduct.save();
        }
      }
    }

    // Lưu thay đổi và trả về dữ liệu đã cập nhật
    const updatedOrder = await userOrder.save();
    return res.status(200).json({ updated: true, data: updatedOrder })
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateOrderProduct = async (req, res) => {
  try {
    const body = req.body;

    // Kiểm tra xem sản phẩm cần cập nhật có tồn tại không
    const existingOrder = await order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({
        message: "Đơn hàng không tồn tại!",
      });
    }

    const updatedProduct = await order.findByIdAndUpdate(req.params.id, body, { new: true });

    return res.status(200).json({
      updated: true,
      data: updatedProduct
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.body;

    // Tìm đơn hàng của người dùng dựa trên orderId
    const userOrder = await order.findOne({ orderCode: orderId });

    if (!userOrder) {
      return res
        .status(404)
        .json({ error: "Đơn hàng của người dùng không khả dụng!" });
    }

    // Xóa đơn hàng
    await order.deleteOne({ orderCode: orderId });

    // userOrder.products = userOrder.products.filter(
    //   (p) => p._id != orderProductId
    // );

    // const data = await userOrder.save();

    return res.status(200).json({ deleted: true, userOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteManyOrder = async (req, res) => {
  try {
    // Lấy danh sách các _id của sản phẩm cần xóa từ req.body
    const ordersToDelete = req.body.map((item) => item._id);

    // Xoá các sản phẩm dựa trên danh sách _id gửi lên từ client
    const result = await order.deleteMany({ _id: { $in: ordersToDelete } });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách order để xóa!",
      });
    }

    // Xóa các id khỏi mảng products trong model category
    // const listCategories = await category.find({});
    // listCategories.forEach(async (category) => {
    //   productsToDelete.forEach((productId) => {
    //     const categoryIndex = category?.products?.indexOf(productId);
    //     if (categoryIndex != -1) {
    //       category.products.splice(categoryIndex, 1);
    //     }
    //   });
    //   await category.save();
    // });

    return res.status(200).json({
      message: "Xoá nhiều order thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};