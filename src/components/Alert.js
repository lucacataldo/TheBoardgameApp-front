import React from "react";
import { Link } from "react-router-dom";
/**********************************************************************
This component have the following props for bootstrap Alert:

type={alertStatus} --> primary, danger, success, warning, etc
message={alertMsg} --> message for alert
visible={alertVisible} --> whether to display the msg (true/false)
redirectTo={alertRedirect} --> optional - link to redirect to "/pageLink"
redirectTxt={alertRedirectTxt} --> optional - link txt 

*************************************************************************
Can use hook or setState: 

const [alertStatus, setAlertStatus] = useState("");
const [alertMsg, setAlertMsg] = useState("");
const [alertVisible, setAlertVible] = useState(false);
const [alertRedirect, setAlertRedirect] = useState("");
const [alertRedirectTxt, setAlertRedirectTxt] = useState("");
**********************************************************************/
class Alert extends React.Component {
  render() {
    if (this.props.visible === true) {
      return (
        <div className="row stickyAlert">
          <div className="container-fluid">
            <div
              className={
                "col-12 alert alert-" +
                this.props.type +
                (this.props.className ? " " + this.props.className : "")
              }
              role="alert"
            >
              {this.props.message}
              {this.props.redirectTo !== undefined &&
                this.props.redirectTxt !== undefined && (
                  <Link to={this.props.redirectTo}>
                    {this.props.redirectTxt}.
                  </Link>
                )}
            
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Alert;
