// Boards Detail
import Container from "@mui/material/Container";
import AppBar from "@/components/AppBar/AppBar";
import BoardBar from "@/pages/Boards/BoardBar/BoardBar";
import BoardContent from "@/pages/Boards/BoardContent/BoardContent";
import { mockData } from "@/apis/mock-data";
import { useEffect, useState } from "react";
import {
  createNewCardAPI,
  createNewColumnAPI,
  deleteColumnDetailsAPI,
  fetchBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
} from "@/apis";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash";
import { generatePlaceholderCard } from "@/utils/formatters";
import { mapOrder } from "@/utils/sorts";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";

const Board = () => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    // const { boardId } = useParams(); // Assumes your route is defined as "/board/:boardId"
    // console.log(boardId);
    const boardId = "6738aa385aacfca400f0a002";
    // Call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      // Sắp xếp thứ tự column ở cha trước khi truyền xuống con
      board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");

      board.columns.forEach((column) => {
        // Xử lý kéo thả column rỗng khi f5
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          // Sắp xếp thứ tự cards ở cha trước khi truyền xuống con
          column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
        }
      });
      // console.log("board", board);
      setBoard(board);
    });
  }, []);

  // Call api create new column và update lại data state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });

    // Xử lý kéo thả 1 column rỗng khi tạo mới column
    createdColumn.cards = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];
    console.log("created column", createdColumn);

    // Cập nhật state board
    const newBoard = { ...board };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    setBoard(newBoard);
  };

  // Call api create new card và update lại data state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    // Cập nhật state board
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    );
    if (columnToUpdate) {
      // some method check dk return true/false
      // column tạo ra có sẵn placeholder card rỗng => bỏ đi ko lấy
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard];
        columnToUpdate.cardOrderIds = [createdCard._id];
      } else {
        columnToUpdate.cards.push(createdCard);
        columnToUpdate.cardOrderIds.push(createdCard._id);
      }
    }
    setBoard(newBoard);
  };

  // Call lại api sau khi kéo thả column => update mảng columnOrderIds của Board chứa nó
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    // Call api update Board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds,
    });
  };

  // Di chuyển card trong cùng 1 column
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    // Cập nhật state board
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    setBoard(newBoard);

    // Call API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds });
  };

  // Di chuyển card khác column
  /**
   * Flow
   * B1. Cập nhật mảng "cardOrderIds" của "column ban đầu" (tức là xóa _id của card vừa di chuyển sang column khác)
   * B2. Cập nhật mảng "cardOrderIds" của "column mới" (tức là thêm _id của card vừa di chuyển ở column mới)
   * B3. Cập nhật lại trường "columnId" của "card đã kéo"
   * => Viết 1 API làm việc này
   */
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    // Gọi API xử lý
    let prevCardOrderIds = dndOrderedColumns.find(
      (column) => column._id === prevColumnId
    )?.cardOrderIds;

    // Xử lý vấn đề khi kéo card cuối cùng ra khỏi column => column rỗng => có placeholder-card => remove trước khi gửi cho BE
    if (prevCardOrderIds[0].includes("placeholder-card") || []) {
      prevCardOrderIds = [];
    }
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(
        (column) => column._id === nextColumnId
      )?.cardOrderIds,
    });
  };

  const deleteColumnDetails = async (columnId) => {
    // Update data state board
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.filter(
      (column) => column._id !== columnId
    );
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (_id) => _id !== columnId
    );
    setBoard(newBoard);

    // Call api delete
    deleteColumnDetailsAPI(columnId).then((res) => {
      toast.success(res?.deleteResult);
    });
  };

  if (!board) {
    return (
      <Box
        sx={{
          // position: "absolute",
          // top: "50%",
          // left: "50%",
          // transform: "translate(-50%, -50%)",
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading board...</Typography>
      </Box>
    );
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  );
};

export default Board;
