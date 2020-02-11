import React from "react";
import BgLogo from "../images/BgLogo.png";

class Home extends React.Component {
    render() {
        return (
            <div className="bgImage mx-auto my-auto d-flex justify-content-center"  >
                <div className="mx-auto my-auto text-center col-6">
                    <img className="align-items-center justify-content-center" src={`${BgLogo}`} alt="Boardgame Guru Logo" />
                    <h2 style={{ color: "white" }}> The Boardgame Guru</h2>
                    <p style={{ color: "white" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div >
        )
    }
}
export default Home;
