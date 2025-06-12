import { useEffect, useState } from "react";
import moment from "moment";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import DoneIcon from "@mui/icons-material/Done";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotification,
  fetchInvitationsAPI,
  selectCurrentNotifications,
  updateBoardInvitationAPI,
} from "@/redux/notifications/notificationsSlice";
import { socketIoInstance } from "@/socketClient";
import { selectCurrentUser } from "@/redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const BOARD_INVITATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  // Variable check new notification
  const [newNotification, setNewNotification] = useState(false);

  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget);
    // When clicking on the icon, reset the newNotification variable to false
    setNewNotification(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Get user data from redux
  const currentUser = useSelector(selectCurrentUser);

  // Get notification data from redux
  const notifications = useSelector(selectCurrentNotifications);

  // Fetch list of invitations
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchInvitationsAPI());

    // Create a processing function when receiving real-time events, docs guide
    // https://socket.io/how-to/use-with-react
    const onReceiveNewInvitation = (invitation) => {
      // If the current logged in user that we save in redux is the invitee in the invitation record
      if (invitation.inviteeId === currentUser._id) {
        // Step 1. Add new invitation record into redux
        dispatch(addNotification(invitation));
        // Step 2. Update status of incoming notification
        setNewNotification(true);
      }
    };

    // Listen for a real-time event named BE_USER_INVITED_TO_BOARD sent from the server
    socketIoInstance.on("BE_USER_INVITED_TO_BOARD", onReceiveNewInvitation);

    // Clean up event to prevent duplicate event registrations
    // https://socket.io/how-to/use-with-react#cleanup
    return () => {
      socketIoInstance.off("BE_USER_INVITED_TO_BOARD", onReceiveNewInvitation);
    };
  }, [dispatch, currentUser._id]);

  // Update the status of the join board invitation
  const updateBoardInvitation = (status, invitationId) => {
    dispatch(updateBoardInvitationAPI({ status, invitationId })).then((res) => {
      // console.log("🚀 ~ dispatch ~ res:", res);
      if (
        res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED
      ) {
        navigate(`/boards/${res.payload.boardInvitation.boardId}`);
      }
    });
  };

  return (
    <Box>
      <Tooltip title='Notifications'>
        <Badge
          color='warning'
          variant={newNotification ? "dot" : "none"}
          sx={{ cursor: "pointer" }}
          id='basic-button-open-notification'
          aria-controls={open ? "basic-notification-drop-down" : undefined}
          aria-haspopup='true'
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon
            sx={{
              color: newNotification ? "yellow" : "white",
            }}
          />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id='basic-notification-drop-down'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "basic-button-open-notification" }}
      >
        {(!notifications || notifications.length === 0) && (
          <MenuItem sx={{ minWidth: 200 }}>
            You do not have any new notifications.
          </MenuItem>
        )}
        {notifications?.map((notification, index) => (
          <Box key={index}>
            <MenuItem
              sx={{
                minWidth: 200,
                maxWidth: 360,
                overflowY: "auto",
              }}
            >
              <Box
                sx={{
                  maxWidth: "100%",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {/* Message content */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box>
                    <GroupAddIcon fontSize='small' />
                  </Box>
                  <Box>
                    <strong>{notification.inviter?.displayName}</strong> had
                    invited you to join the board{" "}
                    <strong>{notification.board?.title}</strong>
                  </Box>
                </Box>

                {/* When the Status of this notification is PENDING, 2 Buttons will appear */}
                {notification.boardInvitation.status ===
                  BOARD_INVITATION_STATUS.PENDING && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      className='interceptor-loading'
                      type='submit'
                      variant='contained'
                      color='success'
                      size='small'
                      onClick={() =>
                        updateBoardInvitation(
                          BOARD_INVITATION_STATUS.ACCEPTED,
                          notification._id
                        )
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      className='interceptor-loading'
                      type='submit'
                      variant='contained'
                      color='secondary'
                      size='small'
                      onClick={() =>
                        updateBoardInvitation(
                          BOARD_INVITATION_STATUS.REJECTED,
                          notification._id
                        )
                      }
                    >
                      Reject
                    </Button>
                  </Box>
                )}

                {/* When the Status of this notification is ACCEPTED or REJECTED, that information will be displayed */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "flex-end",
                  }}
                >
                  {notification.boardInvitation.status ===
                    BOARD_INVITATION_STATUS.ACCEPTED && (
                    <Chip
                      icon={<DoneIcon />}
                      label='Accepted'
                      color='success'
                      size='small'
                    />
                  )}

                  {notification.boardInvitation.status ===
                    BOARD_INVITATION_STATUS.REJECTED && (
                    <Chip
                      icon={<NotInterestedIcon />}
                      label='Rejected'
                      size='small'
                    />
                  )}
                </Box>

                {/* Time of notification */}
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant='span' sx={{ fontSize: "13px" }}>
                    {moment(notification.createdAt).format("llll")}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {/* The Divider line will not be visible if it is the last element */}
            {index !== notifications?.length - 1 && <Divider />}
          </Box>
        ))}
      </Menu>
    </Box>
  );
}

export default Notifications;
