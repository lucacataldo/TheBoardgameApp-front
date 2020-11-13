import React, { useEffect } from "react";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Card from "./Card";
import { cs } from "date-fns/esm/locale";

export default function Notification(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [hasNew, setHasNew] = React.useState(false);

  useEffect(() => {
    const local = localStorage.getItem("notifications");
    if (local === null) {
      setNotifications(props.notificationsObj);
      var n = [];
      props.notificationsObj.forEach(notify => {
        n.push(JSON.stringify(notify));
      });

      console.log(n);

      console.log(JSON.stringify(props.notificationsObj));
      localStorage.notifications = props.notificationsObj;

      setHasNew(true);
    } else {
      setNotifications(props.notificationsObj);
      setHasNew(false);
    }
  });

  const handleClickOpen = event => {
    setAnchorEl(event.currentTarget);
    setHasNew(false);
  };

  const handleClose = value => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton aria-label="notification" onClick={handleClickOpen}>
        {hasNew ? (
          <Badge badgeContent={" "} color="secondary">
            <NotificationsIcon />
          </Badge>
        ) : (
          <NotificationsIcon />
        )}
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
          {notifications.map(item => {
            return <Card name={item.name} nType={item.type}></Card>;
          })}
        </div>
      </Popover>
    </div>
  );
}
