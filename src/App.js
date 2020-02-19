import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./MainRouter";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => (
    <BrowserRouter>
        <MainRouter />
    </BrowserRouter>
);

export default App;
