import { API_ROOT } from "@/utils/constants";
import authorizedAxiosInstance from "@/utils/authorizeAxios";

// *Axios trả về kết quả thông qua property là data
// *Ở axios ko cần try/catch
// => Gây ra dư thừa code
// ==> Giải pháp clean code gọn gàn trong axios đó là catch lỗi tập trung tại một nơi bằng cách tận dụng một thứ cực kỳ mạnh mẽ trong axios là Interceptors

/**
 *
 * @param {*} boardId
 * @returns
 */

// Boards
// Moved to redux
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
//   return response.data;
// };

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  );
  return response.data;
};

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  );
  return response.data;
};

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/columns`,
    newColumnData
  );
  return response.data;
};

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  );
  return response.data;
};

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/columns/${columnId}`
  );
  return response.data;
};

// Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/cards`,
    newCardData
  );
  return response.data;
};
