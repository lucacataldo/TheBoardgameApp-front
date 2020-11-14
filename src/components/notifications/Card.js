import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    padding: "8px",
    marginBottom: "4px"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 6
  },
  hoverStyle: {
    opacity: 0.4,
    cursor: "pointer"
  }
});

export default function SimpleCard(props) {
  const [inHover, setHover] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const classes = useStyles();

  const handleClickCard = () => {
    setClicked(true);
  };

  return (
    <Card
      className={`${classes.root} ${inHover && classes.hoverStyle}`}
      onClick={handleClickCard}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <CardContent>
        <Typography variant="h5" component="h3">
          {props.name}
        </Typography>
        {clicked ? null : (
          <Badge className="float-right" color="secondary" variant="dot" />
        )}

        <Typography className={classes.pos} color="textSecondary">
          {props.nType}
        </Typography>
      </CardContent>
      <hr className="solid my-0" />
    </Card>
  );
}
