import { notification } from "../models/index.js";

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
            sort: {
                [_sort]: _order === "asc" ? 1 : -1,
            },
        };

        const data = await notification.paginate({}, options);

        if (!data || data.docs.length === 0) {
            return res.status(404).json({
                message: "Không có thông báo",
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getAllToAdmin = async (req, res) => {
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
            sort: {
                [_sort]: _order === "asc" ? 1 : -1,
            },
        };

        const data = await notification.paginate({ to: "admin" }, options);
        // const data = await notification.find({ to: "admin" });

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Không có thông báo",
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getAllToClient = async (req, res) => {
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
            sort: {
                [_sort]: _order === "asc" ? 1 : -1,
            },
        };

        const data = await notification.paginate({ to: "client" }, options);

        if (!data || data.docs.length === 0) {
            return res.status(404).json({
                message: "Không có thông báo",
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const addNotification = async (req, res) => {
    try {
        const data = await notification.create(req.body);
        if (!data) {
            return res.status(404).json({
                added: "Tạo thông báo thất bại!",
            });
        } else {
            return res.status(200).json({
                added: true
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const data = await notification.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(500).json({
                message: "Xóa thất bại!",
            });
        }

        return res.status(200).json({
            message: "Xoá thành công!",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updateStatusNotification = async (req, res) => {
    try {
        const data = await notification.findOne({ _id: req.body._id });

        if (!data) {
            return res.status(404).json({
                added: "không tìm thấy thông báo!",
            });
        }

        data.isRead = true;
        await data.save();

        return res.status(200).json({
            updated: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updateAllStatusNotification = async (req, res) => {
    try {
        // Tìm tất cả các thông báo được gửi tới admin
        const notifications = await notification.find({ to: req.body.to });

        if (!notifications) {
            return res.status(404).json({
                message: "Không tìm thấy thông báo!",
            });
        }

        // Cập nhật trạng thái của tất cả các thông báo thành đã đọc
        const result = await notification.updateMany(
            { to: "admin" }, // Điều kiện để lựa chọn các thông báo cần cập nhật
            { isRead: true } // Dữ liệu cần cập nhật
        );

        return res.status(200).json({
            updated: true,
            result: result // Thông tin về số lượng tài liệu đã được cập nhật
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
