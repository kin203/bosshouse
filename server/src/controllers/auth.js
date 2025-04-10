import bcryptjs from "bcryptjs";
import { userSchema, userSignin, userSignup } from "../validate/index.js";
import { user } from "../models/index.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const signup = async (req, res) => {
  try {
    const { error } = userSignup.validate(req.body);
    if (error) {
      return res.status(404).json({
        messages: error.message
      });
    }

    const findUser = await user.findOne({ email: req.body.email });
    if (findUser) {
      return res.status(400).json({ messages: "Tài khoản đã tồn tại!" });
    }

    const pwHash = await bcryptjs.hash(String(req.body.password), 10);
    const data = await user.create({
      ...req.body,
      password: pwHash,
      confirmPassword: undefined,
      // roleId: "5f7b2a2c7f6b6b0b0b0b0b0b"
    });

    if (!data) {
      return res.status(404).json({
        messages: "Đăng ký thất bại!"
      });
    }

    return res.status(200).json({
      messages: "Đăng ký thành công!",
      data: {
        ...req.body,
        password: undefined,
        confirmPassword: undefined
      }
    });
  } catch (error) {
    return res.status(404).json({
      messages: error.message
    });
  }
};

const signin = async (req, res) => {
  try {
    const { error } = userSignin.validate(req.body);
    if (error) {
      return res.status(404).json({
        messages: error.message
      });
    }

    const findUser = await user.findOne({ email: req.body.email });
    if (!findUser) {
      return res.status(404).json({
        messages: "Tài khoản không tồn tại!"
      });
    }

    const checkPassword = await bcryptjs.compare(
      req.body.password,
      findUser.password
    );
    if (!checkPassword) {
      return res.status(404).json({
        messages: "Mật khẩu không chính xác!"
      });
    }

    const token = await jwt.sign({ findUser }, process.env.TOKEN, {
      expiresIn: "7d"
    });

    // findUser.password = undefined;

    return res.status(200).json({
      messages: "Đăng nhập thành công!",
      findUser,
      token
    });
  } catch (error) {
    return res.status(404).json({
      messages: error.message
    });
  }
};

const getAll = async (req, res) => {
  try {
    // const data = await user.find({});
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
    const data = await user.paginate({}, options);

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách user!"
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const getAllNoPaginate = async (req, res) => {
  try {
    const data = await user.find({});

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách user!"
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const getOne = async (req, res) => {
  try {
    const data = await user.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getByEmail = async (req, res) => {
  try {
    const data = await user.find({ email: req.body.email });

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    let body = req.body;

    const { error } = userSchema.validate(body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    } else {
      if (body.password) {
        const pwHash = await bcryptjs.hash(String(req.body.password), 10);
        body = { ...body, password: pwHash };
      }

      const data = await user.findByIdAndUpdate(req.params.id, body, {
        new: true
      });

      if (!data) {
        return res.status(404).json({
          message: "Cập nhật user thất bại!"
        });
      }

      return res.status(200).json({
        updated: true,
        data
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const fogotPassword = async (req, res) => {
  const { email } = req.body;

  const checkEmail = await user.findOne({ email: email });

  if (!email) {
    return res.status(400).json({ message: "nhập đầy đủ thông tin" });
  }
  if (!checkEmail) {
    return res
      .status(400)
      .json({ message: "email không tồn tại trong hệ thống" });
  }

  try {
    if (email) {
      const newPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      const users = await user.findOne({ email: email });
      if (users) {
        users.password = hashedPassword;
        await users.save();
      }

      const tranfoted = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "fptkiki@gmail.com",
          pass: "xwyedsdaifdkewsy"
        }
      });
      const info = await tranfoted.sendMail({
        from: '"BossHouse Shop" <fptkiki@gmail.com>',
        to: email,
        subject: "BossHouse Password Reset",
        html: `
            <p>Mật khẩu mới của tài khoản ${email} là: <strong>${newPassword}</strong></p>
            <p>Vui lòng giữ thông tin này riêng tư và không chia sẻ với người khác.</p>
            <p>Để bảo mật tài khoản. Hãy đổi mật khẩu ngay sau khi đăng nhập thành công.<p/>
            <p>Trân trọng!<p/>
          `
      });
      return res.status(200).json(info);
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const data = await user.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Xóa danh mục thất bại!",
      });
    }

    return res.status(200).json({
      message: "Xoá danh thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteManyUser = async (req, res) => {
  try {
    // Lấy danh sách các _id của sản phẩm cần xóa từ req.body
    const UsersToDelete = req.body.map((item) => item._id);

    // Xoá các sản phẩm dựa trên danh sách _id gửi lên từ client
    const result = await user.deleteMany({ _id: { $in: UsersToDelete } });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm để xóa!",
      });
    }

    return res.status(200).json({
      message: "Xoá nhiều sản phẩm thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default { signup, signin, getAll, getOne, updateUser, deleteUser, deleteManyUser, fogotPassword, getByEmail, getAllNoPaginate };
