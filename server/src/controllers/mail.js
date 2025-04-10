import { sendMailStatusOrder, sendMailOrder } from "../services/nodemailer.js";

export const sendMailController = async (req, res) => {
  try {
    const { email, type, status, data, orderId } = req.body;
    // console.log(data);

    if (type == "order") {
      await sendMailOrder({ email, data, orderId, status });
    } else {
      await sendMailStatusOrder({ email, status, orderId, data });
    }

    return res.status(200).json({ message: "Send email successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
