import React, { Component } from 'react';
import './App.css';
import StarWarsTable from './StarWarsTable.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Star Wars Character List</h1>
        </header>
        <div>
          <StarWarsTable />
        </div>
      </div>
    );
  }
}

export default App;
