import blog from "../models/blogs.js";
import schemaBlog from "../validate/blog.js";

const getAllBlogs = async (req, res) => {
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

        const data = await blog.paginate({}, options);

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy bài viết",
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getAllBlogNoPaginate = async (req, res) => {
    try {
        const data = await blog.find({});

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy bài viết",
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

const getOneBlog = async (req, res) => {
    try {
        const data = await blog.findById(req.params.id)

        if (!data) {
            return res.status(404).json({
                message: "Không tìm thấy bài viết!",
            });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const addBlog = async (req, res) => {
    try {
        const { error } = schemaBlog.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        } else {
            const data = await blog.create(req.body);
            if (!data) {
                return res.status(404).json({
                    message: "Tạo bài viết thất bại!",
                });
            } else {
                return res.status(200).json({
                    message: "Tạo bài viết thành công!",
                    data,
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateBlog = async (req, res) => {
    try {
        const body = req.body;
        const { error } = schemaBlog.validate(body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        } else {
            const data = await blog.findByIdAndUpdate(req.params.id, body, { new: true })

            if (!data) {
                return res.status(404).json({
                    message: "Cập nhật bài viết thất bại!",
                });
            }

            return res.status(200).json({
                message: "Cập nhật bài viết thành công!",
                data,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const data = await blog.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(500).json({
                message: "Xóa bài viết thất bại!",
            });
        }

        return res.status(200).json({
            message: "Xoá bài viết thành công!",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export default {
    getAllBlogs,
    getOneBlog,
    addBlog,
    updateBlog,
    deleteBlog,
    getAllBlogNoPaginate
}