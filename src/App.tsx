import React from 'react';
import './App.css';
import NameList from './components/NameList';
import Wheel from './components/Wheel'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Wheel of choosings</h1>
      </header>
      <NameList/>
      <Wheel/>
    </div>
  );
}

export default App;
