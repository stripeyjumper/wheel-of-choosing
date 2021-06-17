import React from "react";
import { Provider } from "react-redux";
import reducer from "./services/wheel-reducer";
import { configureStore } from "@reduxjs/toolkit";

import WheelPanel from "./components/WheelPanel";
import ListPanel from "./components/ListPanel";
import PageContainer from "./components/PageContainer";

const store = configureStore({ reducer });

function App() {
  return (
    <Provider store={store}>
      <PageContainer className="App">
        <WheelPanel />
        <ListPanel />
      </PageContainer>
    </Provider>
  );
}

export default App;
