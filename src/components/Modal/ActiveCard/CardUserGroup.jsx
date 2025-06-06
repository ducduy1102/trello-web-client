import { useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import AddIcon from "@mui/icons-material/Add";
import Badge from "@mui/material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function CardUserGroup({ cardMemberIds = [] }) {
  /**
   * https://mui.com/material-ui/react-popover/
   */
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null);
  const isOpenPopover = Boolean(anchorPopoverElement);
  const popoverId = isOpenPopover ? "card-all-users-popover" : undefined;
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget);
    else setAnchorPopoverElement(null);
  };

  return (
    <Box sx={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
      {/* Display users who are members of the card */}
      {[...Array(8)].map((_, index) => (
        <Tooltip title='ducduydev' key={index}>
          <Avatar
            sx={{ width: 34, height: 34, cursor: "pointer" }}
            alt='ducduydev'
            src='https://trungquandev.com/wp-content/uploads/2019/06/trungquandev-cat-avatar.png'
          />
        </Tooltip>
      ))}

      {/* Opens the add member popover */}
      <Tooltip title='Add new member'>
        <Box
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          sx={{
            width: 36,
            height: 36,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "50%",
            color: (theme) =>
              theme.palette.mode === "dark" ? "#90caf9" : "#172b4d",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "#2f3542"
                : theme.palette.grey[200],
            "&:hover": {
              color: (theme) =>
                theme.palette.mode === "dark" ? "#000000de" : "#0c66e4",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "#90caf9" : "#e9f2ff",
            },
          }}
        >
          <AddIcon fontSize='small' />
        </Box>
      </Tooltip>

      {/* When clicking on "+"" above, a popover will open showing all users in the board for users to click and add to the card */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box
          sx={{
            p: 2,
            maxWidth: "260px",
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {[...Array(16)].map((_, index) => (
            <Tooltip title='ducduydev' key={index}>
              {/* Avatar + badge icon: https://mui.com/material-ui/react-avatar/#with-badge */}
              <Badge
                sx={{ cursor: "pointer" }}
                overlap='rectangular'
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <CheckCircleIcon fontSize='small' sx={{ color: "#27ae60" }} />
                }
              >
                <Avatar
                  sx={{ width: 34, height: 34 }}
                  alt='ducduydev'
                  src='https://trungquandev.com/wp-content/uploads/2019/06/trungquandev-cat-avatar.png'
                />
              </Badge>
            </Tooltip>
          ))}
        </Box>
      </Popover>
    </Box>
  );
}

export default CardUserGroup;
