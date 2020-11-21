import React, { useEffect } from "react";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Card from "./Card";
import { Link } from "react-router-dom";
//Red notification marker to be fixed with Context is implemented
export default function Notification(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([{}]);
  const [hasNew, setHasNew] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const local = localStorage.getItem("notifications");

    props.notificationsObj.then(result => {
      if (local === null) {
        setNotifications(result);
        console.log(JSON.stringify(props.notificationsObj));
        localStorage.setItem("notifications", JSON.stringify(result));
        setHasNew(true);
        setIsLoading(false);
      } else {
        let localNotifications = JSON.parse(local);
        console.log(localNotifications);
        console.log(result);
        if (localNotifications.length === result.length) {
          console.log("the same");
          setHasNew(false);
          setNotifications(localNotifications);
          setIsLoading(false);
        } else {
          console.log("not the same");

          let diff = result.filter(
            ({ id: id1 }) =>
              !localNotifications.some(({ id: id2 }) => id2 === id1)
          );

          console.log(diff);
          diff.forEach(item => {
            localNotifications.push(item);
          });

          setHasNew(true);
          setNotifications(localNotifications);
          setIsLoading(false);
          localStorage.setItem(
            "notifications",
            JSON.stringify(localNotifications)
          );
        }
      }
    });
  }, [props.notificationsObj]);

  const handleClickOpen = event => {
    setAnchorEl(event.currentTarget);
    setHasNew(false);
  };

  const handleClose = value => {
    setAnchorEl(null);
  };

  const handleClickCard = id => {
    let localNotifications = JSON.parse(localStorage.getItem("notifications"));
    let foundIdx = localNotifications.findIndex(element => element.id === id);
    localNotifications[foundIdx].isRead = true;
    localStorage.setItem("notifications", JSON.stringify(localNotifications));
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
          {isLoading
            ? "Loading..."
            : notifications.map((item, i) => {
                return (
                  <Link key={i} to={item.link}>
                    <Card
                      handleClickCard={() => handleClickCard(item.id)}
                      isRead={item.isRead}
                      name={item.name}
                      nType={item.type}
                    ></Card>
                  </Link>
                );
              })}
        </div>
      </Popover>
    </div>
  );
}
