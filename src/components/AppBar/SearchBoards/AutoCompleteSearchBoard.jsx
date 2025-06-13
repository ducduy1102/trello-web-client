import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { createSearchParams, useNavigate } from "react-router-dom";
import { fetchBoardsAPI } from "@/apis";
import { useDebounceFn } from "@/customHooks/useDebounceFn";

/**
 * https://mui.com/material-ui/react-autocomplete/#asynchronous-requests
 */
function AutoCompleteSearchBoard() {
  const navigate = useNavigate();

  // State handles displaying fetched results from API
  const [open, setOpen] = useState(false);
  // State stores the list of fetched boards
  const [boards, setBoards] = useState(null);
  // Loading when start call api fetch boards
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When closing the result list, clear the boards to null
    if (!open) {
      setBoards(null);
    }
  }, [open]);

  // Process the data received from the input then call the API to get the result (need to add useDebounceFn as below)
  const handleInputSearchChange = (event) => {
    const searchValue = event.target?.value;
    if (!searchValue) return;

    // Use react-router-dom's createSearchParams to create a standard searchPath with q[title] to call the API
    const searchPath = `?${createSearchParams({ "q[title]": searchValue })}`;
    // Expand
    // const searchPath = `?${createSearchParams({ "q[title]": searchValue, "q[desc]": searchDescription })}`;

    // Call API...
    setLoading(true);
    fetchBoardsAPI(searchPath)
      .then((res) => {
        setBoards(res.boards || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // Do useDebounceFn...
  const debounceSearchBoard = useDebounceFn(handleInputSearchChange, 1000);

  // When we select a specific board, we will navigate to that board
  const handleSelectedBoard = (event, selectedBoard) => {
    // Check if a specific board is selected before calling navigate
    if (selectedBoard) {
      navigate(`/boards/${selectedBoard._id}`);
    }
  };

  return (
    <Autocomplete
      sx={{ width: 220 }}
      id='asynchronous-search-board'
      // This text appears when boards is null or after fetching boards but it is empty - no results
      noOptionsText={!boards ? "Type to search board..." : "No board found!"}
      // Handle opening and closing of search results
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      // getOptionLabel: let Autocomplete get the title of the board and display it
      getOptionLabel={(board) => board.title}
      options={boards || []}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      loading={loading}
      // onInputChange will run when typing content into the input tag
      onInputChange={debounceSearchBoard}
      // onChange of the entire Autocomplete will run when we select a result (here is board)
      onChange={handleSelectedBoard}
      // Render the input tag to enter search content
      renderInput={(params) => (
        <TextField
          {...params}
          label='Type to search...'
          size='small'
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: "white" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress sx={{ color: "white" }} size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            "& label": { color: "white" },
            "& input": { color: "white" },
            "& label.Mui-focused": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            ".MuiSvgIcon-root": { color: "white" },
          }}
        />
      )}
    />
  );
}

export default AutoCompleteSearchBoard;
