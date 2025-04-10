import usersVoucher from "../models/usersVoucher.js";
import voucher from "../models/voucher.js";
import { schemaVoucher } from "../validate/index.js";
import moment from "moment";

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

    // const data = await voucher.find({});
    const data = await voucher.paginate({}, options);

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy voucher!",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const data = await voucher.findById(req.params.id).exec();

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy voucher!",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const addVoucher = async (req, res) => {
  try {
    const { error } = schemaVoucher.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const existingVoucher = await voucher.findOne({ code: req.body.code });
    if (existingVoucher) {
      return res.status(409).json({
        message: "Voucher đã tồn tại!",
      });
    }

    const newVoucher = await voucher.create(req.body);

    if (!newVoucher) {
      return res.status(500).json({
        message: "Tạo mới voucher thất bại!",
      });
    }

    return res.status(200).json({
      message: "Tạo mới voucher thành công!",
      data: newVoucher,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi không mong muốn!",
      error: error.message,
    });
  }
};

const updateVoucher = async (req, res) => {
  try {
    const body = req.body;
    const { error } = schemaVoucher.validate(body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    } else {
      const data = await voucher.findByIdAndUpdate(req.params.id, body);

      if (data.acknowledged === false) {
        return res.status(404).json({
          message: "Cập nhật voucher thất bại!",
        });
      }

      return res.status(200).json({
        message: "Cập nhật voucher thành công!",
        data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteVoucher = async (req, res) => {
  try {
    const data = await voucher.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Xóa voucher thất bại!",
      });
    }

    return res.status(200).json({
      message: "Xoá voucher thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const applyVoucher = async (req, res, next) => {
  try {
    const { userId, voucherCode, totalPrice } = req.body;

    // Kiểm tra xem người dùng đã sử dụng voucher này chưa
    const userUsed = await userUsedVoucher.findOne({
      userId: userId,
      voucherCode: voucherCode,
    });
    if (userUsed) {
      return res.status(400).json({ error: "Bạn đã sử dụng voucher này rồi!" });
    }

    // Kiểm tra xem voucher có tồn tại không
    const findVoucher = await voucher.findOne({
      code: voucherCode,
    });
    if (!findVoucher) {
      return res.status(404).json({ error: "Voucher không tồn tại!" });
    }

    // Kiểm tra xem voucher đã hết hạn chưa
    const currentDate = new Date();
    const currentDateMoment = moment(currentDate).format("YYYY-MM-DD hh:mm:ss");

    const expirationDate = findVoucher.expirationDate;

    if (
      currentDateMoment <
      moment(expirationDate[0]).format("YYYY-MM-DD hh:mm:ss") ||
      currentDateMoment >
      moment(expirationDate[1]).format("YYYY-MM-DD hh:mm:ss")
    ) {
      return res
        .status(400)
        .json({ error: "Voucher chưa diễn ra hoặc đã hết hạn sử dụng!" });
    }

    // Kiểm tra xem voucher giảm bao nhiêu %, nếu không có thì mặc định là 0
    const discount = findVoucher.discountPercent || 0;

    // Tính giá sau khi áp dụng voucher
    let salePrice = totalPrice - (totalPrice * discount) / 100;

    //Nếu giá sale lơn hơn giá trị tối đa của voucher thì tổng giá chỉ trừ đi giá trị tối đa của voucher
    if (
      (totalPrice * discount) / 100 > findVoucher?.maxDiscount ||
      salePrice < 0
    )
      salePrice = totalPrice - findVoucher?.maxDiscount;

    findVoucher.maximum -= 1;

    if (findVoucher.maximum <= 0) {
      return res
        .status(400)
        .json({ error: "Voucher đã đạt giới hạn sử dụng!" });
    }

    await findVoucher.save();

    // Sau khi áp dụng voucher thành công, thêm bản ghi vào bảng UsedVoucher
    // const newUsedVoucher = new userUsedVoucher({
    //   userId: userId,
    //   voucherCode: voucherCode
    // });
    // await newUsedVoucher.save();

    return res.status(200).json({ salePrice });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default {
  getAll,
  getOne,
  updateVoucher,
  addVoucher,
  deleteVoucher,
  applyVoucher,
};

// client
export const getVoucherByUserId = async (req, res) => {
  try {
    const data = await usersVoucher.findOne({ userId: req.body.userId });

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy userId!",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const userAddVoucher = async (req, res) => {
  try {
    let existingVoucher = await usersVoucher.findOne({
      userId: req.body.userId,
    });

    // Nếu không tìm thấy userId, tạo mới bản ghi và thêm mã code vào mảng codes
    if (!existingVoucher) {
      existingVoucher = await usersVoucher.create({
        userId: req.body.userId,
        codes: [{ ...req.body, codeId: req.body.codeId }],
      });
      return res.status(200).json({
        message: "Thêm voucher thành công!",
      });
    }

    // Nếu tìm thấy userId, kiểm tra xem mã code đã tồn tại trong mảng codes hay không
    const codeExists = existingVoucher.codes.some(
      (item) => item.codeId == req.body.codeId
    );

    // Nếu mã code đã tồn tại, trả về thông báo lỗi
    if (codeExists) {
      return res.status(409).json({
        message: "Voucher này bạn đã lưu trữ!",
      });
    }

    // Nếu mã code chưa tồn tại, thêm nó vào mảng codes và lưu lại
    existingVoucher.codes.unshift({ ...req.body, codeId: req.body.codeId });
    await existingVoucher.save();

    return res.status(200).json({
      message: "Mã voucher đã được thêm thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi không mong muốn!",
      error: error.message,
    });
  }
};

export const updateApplyVoucher = async (req, res) => {
  try {
    let existingVoucher = await usersVoucher.findOne({
      userId: req.body.userId,
    });

    if (!existingVoucher) {
      return res.status(200).json({
        message: "Không tìm thấy userId!",
      });
    }

    const index = existingVoucher.codes.findIndex(i => i.codeId == req.body.voucherId)
    if (index == -1) {
      return res.status(404).json({
        message: "Không tìm thấy mã giảm giá!",
      });
    }

    existingVoucher.codes[index].apply = true
    existingVoucher.codes[index].maximum = existingVoucher.codes[index].maximum - 1
    await existingVoucher.save();

    const voucherModel = await voucher.findOne({ _id: req.body.voucherId })
    voucherModel.maximum = voucherModel.maximum - 1
    await voucherModel.save()

    return res.status(200).json({
      message: 'ok',
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi không mong muốn!",
      error: error.message,
    });
  }
};

// Admin 
export const updateVoucherFromAdmin = async (req, res) => {
  try {
    const updatedVoucher = req.body;

    // Tìm tất cả người dùng có mã voucher cần cập nhật
    const userList = await usersVoucher.find({ 'codes.codeId': updatedVoucher._id });

    // Duyệt qua từng người dùng có mã voucher cần cập nhật
    await Promise.all(userList.map(async (user) => {
      // Duyệt qua từng mã voucher trong danh sách của người dùng
      for (let i = 0; i < user.codes.length; i++) {
        const currentCode = user.codes[i];
        // Kiểm tra nếu mã voucher có _id trùng với _id của updatedVoucher
        if (currentCode.codeId == updatedVoucher._id) {
          // Cập nhật thông tin mới cho mã voucher
          user.codes[i] = { codeId: updatedVoucher._id, ...updatedVoucher };
        }
      }
      // Lưu thay đổi vào cơ sở dữ liệu
      await user.save();
    }));

    // Cập nhật thông tin của mã voucher trong model voucher
    // await voucher.findByIdAndUpdate(updatedVoucher._id, updatedVoucher);

    return res.status(200).json({ updated: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteVoucherFromAdmin = async (req, res) => {
  try {
    // Tìm tất cả các tài liệu trong collection cart chứa sản phẩm có _id trùng khớp với productId
    const listVouchers = await usersVoucher.find({ codes: { $elemMatch: { codeId: req.body.voucherId } } });

    for (const item of listVouchers) {
      item.codes = item.codes.filter(c => c.codeId != req.body.voucherId);

      // Lưu thay đổi vào cơ sở dữ liệu
      await item.save();
    }

    // Trả về thông báo thành công
    return res.status(200).json({ deleted: true });
  } catch (error) {
    // Trả về thông báo lỗi nếu có lỗi xảy ra
    return res.status(500).json({ error: error.message });
  }
};


