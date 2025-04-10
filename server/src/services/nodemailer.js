import nodemailer from "nodemailer";

const sendMailOrder = async ({ email, status, orderId, data }) => {
  const subTotal = data.products?.reduce((acc, product) => acc + product.sizes.find(i => i.size == product.selectedSize).price * product.selectedQuantity, 0);
  const total = subTotal;

  const productListHTML = data.products.map(product => {
    return `
      <tr>
        <td style="border: 1px solid #dddddd; padding: 8px;"><img src="${product.images[0].response.urls[0]}" alt="${product.name}" style="max-width: 100px;"></td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${product.name}</td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${product.selectedSize}</td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${product.selectedQuantity}</td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${product.sizes?.find(i => i.size == product.selectedSize).price} VNĐ</td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${product.selectedQuantity * product.sizes.find(i => i.size == product.selectedSize).price} VNĐ</td>
      </tr>
    `;
  }).join("");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS_MAIL,
    },
  });

  const info = await transporter.sendMail({
    from: '"BossHouse" <tatiep179@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "BossHouse - Đơn hàng của bạn đã được đặt thành công!", // Subject line
    text: "Hello world?", // plain text body
    html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <p>Xin chào,</p>
        <p>Đơn hàng <b>${data?.orderCode}</b> của bạn tại BossHouse hiện đang có trạng thái: <strong>${status}</strong>.</p>

        <div style="background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px;">
          <p><b>Danh sách sản phẩm:</b></p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Ảnh sản phẩm</th>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Tên sản phẩm</th>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Kích thước</th>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Số lượng</th>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Đơn giá</th>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${productListHTML}
            </tbody>
          </table>

          <p>Tổng tiền cần thanh toán: ${total} VNĐ</p>
        </div>

        <a style='font-weight: 700' href='bosshouse.site/order-history'>  <p>Nhấp vào đây kiểm tra lại thông tin đơn hàng của bạn trên website.</p></a>
        <p>Trân trọng,</p>
        <p>Đội ngũ BossHouse</p>
      </div>
      `, // html body
  });
};



const sendMailStatusOrder = async ({ email, status, orderId, orderCode, data }) => {
  const subTotal = data.products?.reduce((acc, product) => acc + product.sizes.find(i => i.size == product.selectedSize).price * product.selectedQuantity, 0);
  const total = subTotal;

  const productListHTML = data.products?.map(product => {
    return `
      <tr>
        <td style="border: 1px solid #dddddd; padding: 8px;"><img src="${product.images[0].response.urls[0]}" alt="${product.name}" style="max-width: 100px;"></td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${product.name}</td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${product.selectedSize}</td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${product.selectedQuantity}</td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${product.sizes?.find(i => i.size == product.selectedSize).price} VNĐ</td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${product.selectedQuantity * product.sizes.find(i => i.size == product.selectedSize).price} VNĐ</td>
      </tr>
    `;
  }).join("");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS_MAIL,
    },
  });

  const info = await transporter.sendMail({
    from: '"BossHouse" <tatiep179@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "BossHouse - Thông báo trạng thái đơn hàng", // Subject line
    text: "Hello world?", // plain text body
    html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
      <p>Xin chào,</p>
      <p>Đơn hàng <strong>${data?.orderCode}</strong> của bạn tại BossHouse hiện đang có trạng thái: <strong>${status}</strong>.</p>

      <div style="background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px;">
        <p><b>Danh sách sản phẩm:</b></p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Ảnh sản phẩm</th>
              <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Tên sản phẩm</th>
              <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Kích thước</th>
              <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Số lượng</th>
              <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Đơn giá</th>
              <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${productListHTML}
          </tbody>
        </table>

        <p>Tổng cần thanh toán: ${total} VNĐ</p>
      </div>
      <a style='font-weight: bold' href='bosshouse.site/order-history'>  <p>Nhấp vào đây kiểm tra lại thông tin đơn hàng của bạn trên website.</p></a>

      <p>Trân trọng,</p>
      <p>Đội ngũ BossHouse</p>
    </div>
      `, // html body
  });
};

export { sendMailOrder, sendMailStatusOrder };
