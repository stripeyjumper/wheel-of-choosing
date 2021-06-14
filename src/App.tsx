import React from "react";
import MainPage from "./components/MainPage";
import { Provider } from "react-redux";
import reducer from "./service/wheel-reducer";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer });

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <MainPage />
      </div>
    </Provider>
  );
}

export default App;
