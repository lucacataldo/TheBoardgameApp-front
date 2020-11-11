import React from "react";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Card from "./Card";

export default function Notification() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [testObj, setTestObj] = React.useState([
    { name: "George", type: "Offer" },
    { name: "Tom", type: "Group Event" },
    { name: "Marley", type: "Request" }
  ]);

  const handleClickOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = value => {
    setAnchorEl(null);
  };
  const getNotifications = () => {};

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton aria-label="notification" onClick={handleClickOpen}>
        <Badge badgeContent={testObj.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <h3 className="p-3 pt-2" style={{ textDecoration: "underline" }}>
          Notifications
        </h3>
        <div className="container">
          {testObj.map(item => {
            return <Card name={item.name} nType={item.type}></Card>;
          })}
        </div>
      </Popover>
    </div>
  );
}
