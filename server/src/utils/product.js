export function findIndexByProductId(categories, productId) {
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].products.includes(productId)) {
      return i; // Trả về index nếu tìm thấy
    }
  }
  // Trường hợp không tìm thấy
  return -1;
}

export function findIndexByCategoryId(categories, categoryId) {
  for (let i = 0; i < categories.length; i++) {
    if (categories[i]._id == categoryId) {
      return i;
    }
  }
  // Return -1 if not found
  return -1;
}