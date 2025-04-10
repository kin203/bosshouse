import category from "../models/category.js";
import product from "../models/products.js";
import role from "../models/roles.js";
import { schemaCate } from "../validate/index.js";

export const getAll = async (req, res) => {
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

        const data = await role.paginate({}, options);

        if (!data || data.docs.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy vai trò!",
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const data = await role.findById(req.params.id).exec();

        if (!data) {
            return res.status(404).json({
                message: "Không tìm thấy vai trò!",
            });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const addRole = async (req, res) => {
    try {
        const data = await role.create(req.body);

        if (!data) {
            return res.status(404).json({
                message: "Tạo mới vai trò thất bại!",
            });
        }
        return res.status(200).json({
            message: "Tạo mới vai trò thành công!",
            data,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updateRole = async (req, res) => {
    try {
        const body = req.body;

        const data = await role.findByIdAndUpdate(req.params.id, body);

        if (data.acknowledged === false) {
            return res.status(404).json({
                message: "Cập nhật vai trò thất bại!",
            });
        }

        return res.status(200).json({
            message: "Cập nhật vai trò thành công!",
            data,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const data = await role.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({
                message: "Xóa vai trò thất bại!",
            });
        }

        return res.status(200).json({
            message: "Xoá vai trò thành công!",
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

