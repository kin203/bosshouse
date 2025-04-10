import soldProduct from "../models/soldProduct.js";
import {product} from "../models/index.js";

export const getAll = async (req, res) => {
    try {
        const soldProducts = await soldProduct.find({});

        if (!soldProducts || soldProducts.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy",
            });
        }

        // Tạo một mảng mới chứa thông tin chi tiết về sản phẩm
        const data = await Promise.all(soldProducts.map(async (item) => {
            // Lấy thông tin chi tiết sản phẩm từ productId
            const productDetail = await product.findById(item.productId).exec();
            if (!productDetail) {
                // Nếu không tìm thấy thông tin sản phẩm, trả về null
                return null;
            }
            // Trả về đối tượng mới có chứa thông tin chi tiết sản phẩm và các trường khác
            return {
                ...item.toObject(),
                product: productDetail.toObject() // Thêm thông tin chi tiết sản phẩm vào đối tượng
            };
        }));

        // Lọc các phần tử null trong mảng data
        const filteredData = data.filter(item => item !== null);

        return res.status(200).json(filteredData);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const addSoldProduct = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Vui lòng cung cấp productId và quantity.' });
        }

        const existingSoldProduct = await soldProduct.findOne({ productId });

        if (existingSoldProduct) {
            // Nếu đã tồn tại productId, cập nhật quantitySold của sản phẩm đã bán
            existingSoldProduct.quantitySold += quantity;
            await existingSoldProduct.save();

            return res.status(200).json({ added: true });
        } else {
            // Nếu productId chưa tồn tại, tạo một bản ghi mới
            const soldProduct1 = new soldProduct({
                productId,
                quantitySold: quantity
            });

            await soldProduct1.save();

            return res.status(201).json({ added: true });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo bản ghi sản phẩm đã bán.' });
    }
};

export const getOne = async (req, res) => {
    try {
        const data = await soldProduct.findOne({ productId: req.body.productId })

        if (!data) {
            return res.status(404).json({
                message: "Không tìm thấy!",
            });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};