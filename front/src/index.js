import React from "react";
import ReactDOM from "react-dom";
import RandomForestClassifier from "./RandomForestClassifier";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home";
import LSTM from "./LSTM";

ReactDOM.render(
  <React.StrictMode>
  <BrowserRouter>
        <Routes>
          <Route path="/" index element={<Home />}/>
          <Route path="RFC" element={<RandomForestClassifier />} />
          <Route path="LSTM" element={<LSTM/>}/>
        </Routes>
  </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
