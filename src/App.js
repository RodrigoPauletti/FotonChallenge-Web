import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles.css";

import Routes from "./routes";

const App = () => (
  <div className="App">
    <Routes />
    <ToastContainer
      position="top-right"
      autoClose={2000}
      newestOnTop={true}
      closeOnClick
      pauseOnVisibilityChange
      draggable
      pauseOnHover={false}
    />
  </div>
);

export default App;
