import { product  } from "../models/index.js";
import { schemaSearch } from "../validate/index.js";
import category from "../models/category.js";

const search = async (req, res) => {
    try {
        // Use paginate to get paginated products
        const paginatedProducts = await product.find({});
        const listCategory = await category.find({});
        // console.log(listCategory)

        // Filter products based on the keyword
        const filteredProducts = paginatedProducts.filter((d) =>
            d.name.trim().toLowerCase().includes(req.body.keyword.toLowerCase()) ||
            d.description.trim().toLowerCase().includes(req.body.keyword.toLowerCase()) ||
            d.categoryId == req.body.keyword.toLowerCase() ||
            listCategory.filter(i => i._id == d.categoryId).map(i => i.name).toString().toLowerCase().includes(req.body.keyword.toLowerCase())
        );

        if (!filteredProducts || filteredProducts?.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm!",
            });
        }

        return res.status(200).json(filteredProducts);

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export default search;
