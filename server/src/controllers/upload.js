export const uploadImage = async (req, res) => {
  // console.log(req.files)
  // return res.status(200).json('Upload ảnh thành công!');

  // req.files chứa thông tin về các tệp đã tải lên từ client
  // Nếu bạn sử dụng uploadCloud.single('image'), bạn có thể sử dụng req.file
  const uploadedImages = req.files;

  // Xử lý logic tải lên ảnh thành công ở đây
  // Ví dụ: trả về URL của ảnh đã tải lên
  const imageUrls = uploadedImages.map((image) => image.path);

  res.status(200).json({ success: true, urls: imageUrls });
};
