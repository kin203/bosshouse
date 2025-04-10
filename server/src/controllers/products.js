import { product } from "../models/index.js";
import { schemaActive, schemaProduct } from "../validate/index.js";
import category from "../models/category.js";

import {
  findIndexByCategoryId,
  findIndexByProductId,
} from "../utils/product.js";

const getAllProduct = async (req, res) => {
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
    const data = await product.paginate({}, options);

    // const data = await product.find({}).populate("categoryId");

    //* !data.docs
    if (!data || data.docs.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllProductNoPaginate = async (req, res) => {
  try {
    const data = await product.find({});

    //* !data.docs
    if (!data || data.length == 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Sắp xếp lại mảng newOrders theo sản phẩm mới nhất lên đầu
    data.sort((a, b) => {
      // So sánh thời gian tạo của đơn hàng
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getOneProduct = async (req, res) => {
  try {
    const data = await product.findById(req.params.id).populate("categoryId");

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm!",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const { error } = schemaProduct.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    } else {
      const data = await product.create(req.body);
      if (!data) {
        return res.status(404).json({
          message: "Tạo mới sản phẩm thất bại!",
        });
      }

      await category.findByIdAndUpdate(data.categoryId, {
        $addToSet: {
          products: data._id,
        },
      });
      // const updateCategory = await category.findByIdAndUpdate(data.categoryId, {
      //   $addToSet: {
      //     products: data._id,
      //   },
      // });
      // if (!updateCategory) {
      //   throw new Error("Cập nhật danh mục thất bại!");
      // }

      return res.status(200).json({
        message: "Tạo mới sản phẩm thành công!",
        data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const body = req.body;
    const { error } = schemaProduct.validate(body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Kiểm tra xem sản phẩm cần cập nhật có tồn tại không
    const existingProduct = await product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại!",
      });
    }

    const updatedProduct = await product.findByIdAndUpdate(req.params.id, body, { new: true }).populate("categoryId");

    // Xử lý cập nhật products trong category
    const listCategory = await category.find({});
    const oldCategoryId = existingProduct.categoryId;
    const newCategoryId = body.categoryId;

    // Xóa productId từ products của category cũ
    if (oldCategoryId && oldCategoryId !== newCategoryId) {
      const oldCategory = listCategory.find(cat => cat._id.toString() === oldCategoryId.toString());
      if (oldCategory) {
        oldCategory.products = oldCategory.products.filter(productId => productId.toString() !== req.params.id);
        await oldCategory.save();
      }
    }

    // Thêm productId vào products của category mới
    if (newCategoryId) {
      const newCategory = listCategory.find(cat => cat._id.toString() === newCategoryId.toString());
      if (newCategory) {
        newCategory.products.push(req.params.id);
        await newCategory.save();
      }
    }

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công!",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


const updateActive = async (req, res) => {
  try {
    const body = req.body;
    const { error } = schemaActive.validate(body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    } else {
      const data = await product.findByIdAndUpdate(req.params.id, body, {
        new: true,
      });

      if (!data) {
        return res.status(404).json({
          message: "Cập nhật trạng thái thất bại!",
        });
      }

      return res.status(200).json({
        message: "Cập nhật trạng thái thành công!",
        data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    // Kiểm tra sự tồn tại của sản phẩm
    const existingProduct = await product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại!",
      });
    }

    // Xóa sản phẩm
    const deletedProduct = await product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(500).json({
        message: "Xóa sản phẩm thất bại!",
      });
    }

    // Cập nhật mảng products trong model category
    const listCategory = await category.find({});
    const categoryIndex = findIndexByProductId(listCategory, req.params.id);
    if (categoryIndex !== -1) {
      listCategory[categoryIndex].products = listCategory[categoryIndex].products.filter(productId => productId.toString() !== req.params.id);
      await listCategory[categoryIndex].save();
    }

    return res.status(200).json({
      message: "Xóa sản phẩm thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


const deleteManyProduct = async (req, res) => {
  try {
    // Lấy danh sách các _id của sản phẩm cần xóa từ req.body
    const productsToDelete = req.body.map((item) => item._id);

    // Xoá các sản phẩm dựa trên danh sách _id gửi lên từ client
    const result = await product.deleteMany({ _id: { $in: productsToDelete } });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm để xóa!",
      });
    }

    // Xóa các id khỏi mảng products trong model category
    const listCategories = await category.find({});
    listCategories.forEach(async (category) => {
      productsToDelete.forEach((productId) => {
        const categoryIndex = category?.products?.indexOf(productId);
        if (categoryIndex != -1) {
          category.products.splice(categoryIndex, 1);
        }
      });
      await category.save();
    });

    return res.status(200).json({
      message: "Xoá nhiều sản phẩm thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateManyQuantity = async (req, res) => {
  try {
    const productsToUpdate = req.body;

    for (const item of productsToUpdate) {
      // console.log(item)
      // Kiểm tra sản phẩm tồn tại và có đủ số lượng để cập nhật
      const existingProduct = await product.findOne({ _id: item.product._id });
      if (!existingProduct) {
        return res.status(404).json({
          message: `Không tìm thấy sản phẩm để cập nhật!`,
        });
      }

      const indexSize = existingProduct.sizes.findIndex(s => s.size == item.selectedSize && s.quantity >= item?.selectedQuantity);
      if(indexSize == -1) {
        return res.status(404).json({
          message: `Không tìm thể kiểu sản phãm ${item.selectedSize}, hoặc k đủ số lượng để cập nhật!`,
        });
      }

      // Cập nhật số lượng mới cho sản phẩm
      existingProduct.sizes[indexSize].quantity = existingProduct.sizes[indexSize].quantity - item.selectedQuantity;
      await existingProduct.save();
    }

    return res.status(200).json({
      message: "Cập nhật số lượng cho nhiều sản phẩm thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



export default {
  getAllProduct,
  getOneProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  deleteManyProduct,
  updateManyQuantity,
  updateActive,
  getAllProductNoPaginate
};
