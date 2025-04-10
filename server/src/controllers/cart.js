import cart from "../models/cart.js";
import { product } from "../models/index.js";

export const getAllCart = async (req, res) => {
  try {
    const carts = await cart.find({});
    if (!carts) {
      return res.status(404).json({ error: "Lỗi get giỏ hàng" });
    }

    const cartsWithProducts = await Promise.all(carts.map(async (cart) => {
      const productsWithDetails = await Promise.all(cart.carts.map(async (item) => {
        const productItem = await product.findOne({ _id: item._id });

        return {
          product: productItem,
          selectedSize: item.selectedSize,
          selectedQuantity: item.selectedQuantity,
        };
      }));

      return {
        ...cart.toObject(),
        carts: productsWithDetails
      };
    }));

    return res.status(200).json(cartsWithProducts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const getCartByUserId = async (req, res) => {
  try {
    const cartUser = await cart.findOne({ userId: req.body.userId });

    if (!cartUser) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
    }

    const newCarts = await Promise.all(cartUser.carts.map(async (item) => {
      const productItem = await product.findOne({ _id: item._id });
      return {
        product: productItem,
        selectedSize: item.selectedSize,
        selectedQuantity: item.selectedQuantity,
      };
    }));

    return res.status(200).json({
      ...cartUser.toObject(),
      carts: newCarts
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    let userCart = await cart.findOne({ userId: req.body._userId });

    if (!userCart) {
      userCart = await cart.create({
        userId: req.body._userId,
        carts: [req.body],
      });
      if (!userCart) {
        return res.status(500).json({ created: false });
      }
    }

    else {
      const findIndexItem = userCart.carts.findIndex(i => i._id == req.body._id && i.selectedSize == req.body.selectedSize)
      if (findIndexItem > -1) {
        userCart.carts[findIndexItem].selectedQuantity += req.body.selectedQuantity
      } else {
        userCart.carts.unshift(req.body)
      }
    }
    await userCart.save();

    return res
      .status(200)
      .json({ added: true, length: userCart.carts.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartByUserId = async (req, res) => {
  try {
    const Cart = await cart.findOne({ userId: req.body.userId });
    if (!Cart) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại!" });
    }

    Cart.carts = req.body.carts;
    await Cart.save();

    return res.status(200).json({ message: "Updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userCart = await cart.findOne({ userId: req.body.userId });

    if (!userCart) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
    }

    // // Xóa phần tử khỏi mảng và gán lại vào thuộc tính carts
    // userCart.carts.splice(req.body.index, 1);

    // Tìm vị trí của phần tử trong mảng carts dựa trên _id
    const index = userCart.carts.findIndex(item => item._id === req.body._id);

    // Kiểm tra xem phần tử có tồn tại trong mảng hay không
    if (index === -1) {
      return res.status(404).json({ error: "Không tìm thấy mục trong giỏ hàng" });
    }

    // Xóa phần tử khỏi mảng
    userCart.carts.splice(index, 1);

    // Lưu thay đổi vào cơ sở dữ liệu
    await userCart.save();

    return res.status(200).json({ deleted: true, length: userCart.carts.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProductCartFromAdmin = async (req, res) => {
  try {
    const updatedProduct = req.body;

    const listCart = await cart.find({ carts: { $elemMatch: { _id: updatedProduct._id } } });

    await Promise.all(listCart.map(async (cartItem) => {
      // Duyệt qua tất cả các sản phẩm trong giỏ hàng
      for (let i = 0; i < cartItem.carts.length; i++) {
        const currentItem = cartItem.carts[i];
        // Kiểm tra nếu sản phẩm có _id trùng với _id của updatedProduct
        if (currentItem._id == updatedProduct._id) {
          // Tìm kích thước mới của sản phẩm trong updatedProduct
          const findSize = updatedProduct.sizes.find(item => item.size == currentItem.sizes[0].size);
          // Tạo sản phẩm mới cập nhật với số lượng từ sản phẩm hiện tại
          const newUpdatedProduct = {
            ...updatedProduct,
            sizes: [
              { ...findSize, quantity: currentItem.sizes[0].quantity }
            ]
          };
          // Cập nhật sản phẩm trong giỏ hàng
          cartItem.carts[i] = newUpdatedProduct;
        }
      }

      await cartItem.save();
    }));

    return res.status(200).json({ updated: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProductCartFromAdmin = async (req, res) => {
  try {
    // Tìm tất cả các tài liệu trong collection cart chứa sản phẩm có _id trùng khớp với productId
    const listCarts = await cart.find({ carts: { $elemMatch: { _id: req.body.productId } } });

    for (const userCart of listCarts) {
      // Lọc ra những sản phẩm có _id không trùng khớp với productId
      userCart.carts = userCart.carts.filter(product => product._id != req.body.productId);

      // Lưu thay đổi vào cơ sở dữ liệu
      await userCart.save();
    }

    // Trả về thông báo thành công
    return res.status(200).json({ deleted: true });
  } catch (error) {
    // Trả về thông báo lỗi nếu có lỗi xảy ra
    return res.status(500).json({ error: error.message });
  }
};

