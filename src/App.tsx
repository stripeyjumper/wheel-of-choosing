import React from "react";
import MainPage from "./components/MainPage";
import { Provider } from "react-redux";
import { reducer } from "./components/use-wheels";
import { createStore } from "@reduxjs/toolkit";

const store = createStore(reducer);

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
