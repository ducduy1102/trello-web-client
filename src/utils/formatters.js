/**
 * YouTube: TrungQuanDev - Một Lập Trình Viên
 * Created by trungquandev.com's author on Jun 28, 2023
 */
/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val) => {
  if (!val) return "";
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};

/**
 * Giải quyết bug column rỗng
 * Phía FE tự tạo ra 1 card đặc biệt: Placeholder Card ko liên quan tới BE
 * Card đặc biệt này sẽ được ẩn ở UI (giao diện người dùng)
 * Cấu trúc Id của card này để unique đơn giản, ko cần phải phức tạp:
 * "columnId-placeholder-card" (mỗi column chỉ có thể có tối đa 1 Placeholder Card)
 * Quan trọng khi tạo phải đầy đủ: {_id, boardId, columnId, FE_PlaceholderCard}
 */
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true,
  };
};

export const interceptorLoadingElements = (calling) => {
  const elements = document.querySelectorAll(".interceptor-loading");
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Nếu đang trong thời gian chờ gọi API (calling === true) thì sẽ làm mờ phần tử và chặn click bằng css pointer-events
      elements[i].style.opacity = "0.5";
      elements[i].style.pointerEvents = "none";
    } else {
      // Ngược lại thì trả về như ban đầu, không làm gì cả
      elements[i].style.opacity = "initial";
      elements[i].style.pointerEvents = "initial";
    }
  }
};
