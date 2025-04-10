import { refundHistory, user } from "../models/index.js";

export const getAllRefund = async (req, res) => {
    try {
        // const {
        //     _limit = 10,
        //     _page = 1,
        //     _order = "asc",
        //     _sort = "createdAt",
        // } = req.query;

        // const options = {
        //     page: _page,
        //     limit: _limit,
        //     order: _order,
        //     sort: {
        //         [_sort]: _order === "asc" ? 1 : -1,
        //     },
        // };

        // const data = await refundHistory.paginate({}, options);
        const data = await refundHistory.find({});

        // if (!data || data.docs.length === 0) {
        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy lịch sử!",
            });
        }

        // Sắp xếp lại mảng newOrders theo sản phẩm mới nhất lên đầu
        data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const newData = await Promise.all(data.map(async (item) => {
            const userData = await user.findById(item.userId);
            // item.user = userData;
            return {...item.toObject(), user: userData.toObject()};
        }));

        return res.status(200).json(newData);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const data = await refundHistory.findById(req.params.id).exec();

        if (!data) {
            return res.status(404).json({
                message: "Không tìm thấy lịch sử!",
            });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const addRefund = async (req, res) => {
    try {
        const newRefund = await refundHistory.create(req.body);

        if (!newRefund) {
            return res.status(500).json({
                added: false,
            });
        }

        return res.status(200).json({
            created: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Đã xảy ra lỗi không mong muốn!",
            error: error.message
        });
    }
};