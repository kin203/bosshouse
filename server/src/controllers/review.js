import blog from "../models/blogs.js";
import schemaBlog from "../validate/blog.js";
import { schemaReview } from "../validate/index.js"
import { product, review, user } from "../models/index.js"

export const getAllReviewNoPaginate = async (req, res) => {
    try {
        const data = await review.find({}).exec()

        if (!data || data.length == 0) {
            return res.status(404).json({
                message: "Không tìm thấy bình luận",
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getAllReviewByProductId = async (req, res) => {
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
        //     sort: {
        //         [_sort]: _order === "asc" ? 1 : -1,
        //     },
        // };

        // const data = await review.paginate({ productId: req.body.productId }, options);
        const data = await review.find({ productId: req.body.productId });

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy bình luận",
            });
        }

        const userDataPromises  = data.map(async (review) => {
            const userData = await user.findOne({ _id: review.userId });
            return userData ? userData.toObject() : null;
        });

        // Chờ tất cả các promise hoàn thành và lấy ra các avatar
        const usersData  = await Promise.all(userDataPromises );

        // Thêm avatar vào mỗi bình luận
        const newData = data.map((review, index) => ({
            ...review.toObject(),
            userData: usersData[index],
        }));

        return res.status(200).json(newData);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const findReview = async (req, res) => {
    try {
        const reviewData = await review.findOne({
            userId: req.body.userId,
            productId: req.body.productId,
            selectedSize: req.body.selectedSize,
            selectedQuantity: req.body.selectedQuantity
        }).exec();

        if (!reviewData) {
            return res.status(404).json({
                message: "Không tìm thấy đánh giá!",
            });
        }

        // Lấy thông tin người dùng từ userId
        const userData = await product.findById(req.body.productId).exec();

        // Thêm thông tin người dùng vào đối tượng data
        const data = {
            ...reviewData.toObject(),
            product: userData.toObject()
        };

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const addReview = async (req, res) => {
    try {
        const { error } = schemaReview.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        } else {
            const data = await review.create(req.body);

            if (!data) {
                return res.status(404).json({
                    message: "Tạo bình luận thất bại!",
                });
            } else {
                return res.status(200).json({
                    message: "Tạo bình luận thành công!",
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