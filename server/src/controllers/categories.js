import category from "../models/category.js";
import product from "../models/products.js";
import { schemaCate } from "../validate/index.js";

const getAll = async (req, res) => {
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

    const data = await category.paginate({}, options);

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục!",
      });
    }
    await Promise.all(data.docs.map(async (item) => {
      const listId = item.products;
      const newListProduct = await product.find({ _id: { $in: listId } });

      item.products = newListProduct;
    }));

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllNoPaginate = async (req, res) => {
  try {
    const data = await category.find({});

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục!",
      });
    }

    await Promise.all(data.map(async (item) => {
      const listId = item.products;
      const newListProduct = await product.find({ _id: { $in: listId } });

      item.products = newListProduct;
    }));

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

const getAllNoPaginateDetail = async (req, res) => {
  try {
    const data = await category.find({});

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục!",
      });
    }

    await Promise.all(data.map(async (item) => {
      const listId = item.products;
      const newListProduct = await product.find({ _id: { $in: listId } });

      item.products = newListProduct;
    }));

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const data = await category.findById(req.params.id).exec();

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục!",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const addCate = async (req, res) => {
  try {
    const { error } = schemaCate.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    } else {
      const data = await category.create(req.body);

      if (!data) {
        return res.status(404).json({
          message: "Tạo mới danh mục thất bại!",
        });
      }
      return res.status(200).json({
        message: "Tạo mới danh mục thành công!",
        data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateCate = async (req, res) => {
  try {
    const body = req.body;
    const { error } = schemaCate.validate(body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    } else {
      const data = await category.findByIdAndUpdate(req.params.id, body);

      if (data.acknowledged === false) {
        return res.status(404).json({
          message: "Cập nhật danh mục thất bại!",
        });
      }

      return res.status(200).json({
        message: "Cập nhật danh mục thành công!",
        data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteCate = async (req, res) => {
  try {
    const data = await category.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Xóa danh mục thất bại!",
      });
    }

    return res.status(200).json({
      message: "Xoá danh thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteManyCategory = async (req, res) => {
  try {
    // Lấy danh sách các _id của danh mục cần xóa từ req.body
    const categoryToDelete = req.body.map((item) => item._id);

    // Kiểm tra sự tồn tại của các danh mục trước khi xóa
    const existingCategories = await category.find({ _id: { $in: categoryToDelete } });
    if (existingCategories.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục để xóa!",
      });
    }

    // Xóa các danh mục
    const result = await category.deleteMany({ _id: { $in: categoryToDelete } });

    // Kiểm tra và cập nhật trường categoryId của các sản phẩm
    const productsToUpdate = await product.find({ categoryId: { $in: categoryToDelete } });
    if (productsToUpdate.length > 0) {
      await product.updateMany({ categoryId: { $in: categoryToDelete } }, { categoryId: undefined });
    }

    return res.status(200).json({
      message: "Xoá nhiều danh mục thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default { getAll, getOne, updateCate, deleteCate, addCate, deleteManyCategory, getAllNoPaginate, getAllNoPaginateDetail };
