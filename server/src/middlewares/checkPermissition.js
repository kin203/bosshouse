import jwt from "jsonwebtoken";
import { role } from "../models/index.js";

// export const checkPermission = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       throw new Error("Token not found!");
//     }

//     const decoded = jwt.verify(token, process.env.TOKEN);

//     const roleId = decoded.findUser.roleId;
//     const roleModal = await role.findOne({ _id: roleId });
//     console.log(roleModal)

//     if (decoded.findUser && decoded.findUser.roles.includes('admin')) {
//       next();
//     } else {
//       throw new Error("Bạn không có quyền thực hiện thao tác này!");
//     }
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const checkPermission = (require) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new Error("Token not found!");
      }

      const decoded = jwt.verify(token, process.env.TOKEN);

      const roleId = decoded.findUser.roleId;
      const roleModal = await role.findOne({ _id: roleId });

      if (roleModal.role && roleModal.permissions.includes(require)) {
        next();
      } else {
        throw new Error("Bạn không có quyền thực hiện thao tác này!");
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}
