import blog from "../models/blogs.js";
import { usersAddress } from "../models/index.js";
import schemaBlog from "../validate/blog.js";

export const getAll = async (req, res) => {
    try {
        const data = await usersAddress.find({});

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy danh sách địa chỉ",
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const findByUserId = async (req, res) => {
    try {
        const data = await usersAddress.find({ userId: req.body.userId });

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy địa chỉ của người dùng!",
            });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const addUserAddress = async (req, res) => {
    try {
        const data = await usersAddress.create(req.body);
        if (!data) {
            return res.status(404).json({
                message: "Tạo địa chỉ thất bại!",
            });
        } else {
            if (req.body.default) {
                await usersAddress.updateMany(
                    { userId: req.body.userId, _id: { $ne: data._id } }, // Exclude the newly created address
                    { default: false }
                );
            }

            return res.status(200).json({
                message: "Tạo địa chỉ thành công!",
                data,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const body = req.body;
        const data = await usersAddress.findByIdAndUpdate(req.params.id, body, { new: true })

        if (!data) {
            return res.status(404).json({
                message: "Cập nhật địa thất bại!",
            });
        }

        if (req.body.default) {
            await usersAddress.updateMany(
                { userId: req.body.userId, _id: { $ne: data._id } },
                { default: false }
            );
        }

        return res.status(200).json({
            message: "Cập nhật địa chỉ thành công!",
            data,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteUserAddress = async (req, res) => {
    try {
        const data = await usersAddress.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(500).json({
                message: "Xóa địa chỉ thất bại!",
            });
        }

        return res.status(200).json({
            message: "Xoá địa chỉ thành công!",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
