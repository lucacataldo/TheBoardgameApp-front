import React from "react";

import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Popover from '@material-ui/core/Popover';
import NotificationsIcon from "@material-ui/icons/Notifications";
import Card from "./Card";


export default function Notification() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [testObj,setTestObj] = React.useState([{name:"George", type:"Offer"}, {name:"Tom", type:"Group Event"}, {name:"Marley", type:"Request"}]);

  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = value => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  

  return (
    <div>
      <IconButton aria-label="notification" onClick={handleClickOpen}>
        <Badge badgeContent={4} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <h2>Notifications</h2>
        <div className="container">
          {testObj.map(item=> {
            return(
            <div className="row">
            <Card name={item.name} nType={item.type}></Card>
            </div>)

          } )}
        

        </div>
      </Popover>
    </div>
  );
}
