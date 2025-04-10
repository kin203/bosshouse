import { contact } from "../models/index.js";
import { schemaContact } from "../validate/index.js";

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

        const data = await contact.paginate({}, options);

        // if (!data || data.docs.length === 0) {
        if (!data) {
            return res.status(404).json({
                message: "Không tìm thấy liên hệ!",
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getAllNoPaginate = async (req, res) => {
    try {
        const data = await contact.find({});

        // if (!data || data.docs.length === 0) {
        if (!data) {
            return res.status(404).json({
                message: "Không tìm thấy liên hệ!",
            });
        }

        // Sắp xếp lại mảng newOrders theo sản phẩm mới nhất lên đầu
        data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getOne = async (req, res) => {
    try {
        const data = await contact.findById(req.params.id).exec();

        if (!data) {
            return res.status(404).json({
                message: "Không tìm thấy liên hệ!",
            });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const addContact = async (req, res) => {
    try {
        const { error } = schemaContact.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const newContact = await contact.create(req.body);

        if (!newContact) {
            return res.status(500).json({
                message: "Tạo mới yêu cầu hỗ trợ thất bại!",
            });
        }

        return res.status(200).json({
            created: true,
            data: newContact,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Đã xảy ra lỗi không mong muốn!",
            error: error.message
        });
    }
};

const updateProcessed = async (req, res) => {
    try {
        const body = req.body;
        //   const { error } = schemaContact.validate(body);
        //   if (error) {
        //     return res.status(400).json({
        //       message: error.details[0].message,
        //     });
        //   } else {
        const data = await contact.findByIdAndUpdate(req.params.id, body);

        if (data.acknowledged === false) {
            return res.status(404).json({
                message: "Cập nhật liên hệ thất bại!",
            });
        }

        return res.status(200).json({
            message: "Cập nhật liên hệ thành công!",
            data,
        });
        //   }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deleteContact = async (req, res) => {
    try {
        const data = await contact.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({
                deleted: false,
                message: "Xóa yêu cầu liên hệ thất bại!",
            });
        }

        return res.status(200).json({
            deleted: true,
            message: "Xoá yêu cầu liên hệ thành công!",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deleteManyContact = async (req, res) => {
    try {
        // Lấy danh sách các _id của yêu cầu hỗ trợ cần xóa từ req.body
        const contactsToDelete = req.body.map((item) => item._id);

        // Xoá các yêu cầu hỗ trợ dựa trên danh sách _id gửi lên từ client
        const result = await contact.deleteMany({ _id: { $in: contactsToDelete } });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                deleted: false,
                message: "Không tìm thấy yêu cầu hỗ trợ nào để xóa!",
            });
        }

        return res.status(200).json({
            message: "Xoá nhiều yêu cầu hỗ trợ thành công!",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};


export default {
    getAll,
    getOne,
    addContact,
    deleteContact,
    deleteManyContact,
    updateProcessed,
    getAllNoPaginate
};
