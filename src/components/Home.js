import React from "react";
import BgLogo from "../images/BgLogo.png";

class Home extends React.Component {
    render() {
        return (
            <div className="bgImage mx-auto my-auto d-flex justify-content-center"  >
                <div className="mx-auto my-auto text-center col-6">
                    <img className="align-items-center justify-content-center" src={`${BgLogo}`} alt="Boardgame Guru Logo" />
                    <h2 style={{ color: "white" }}> The Boardgame Guru</h2>
                    <p style={{ color: "white" }}>This all-in-one boardgame website is under development. Find out more once it's done!'</p>
                </div>
            </div >
        )
    }
}
export default Home;
