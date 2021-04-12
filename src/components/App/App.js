import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import InputForm from '../InputForm/InputForm';
import Home from '../Home/Home';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/input-form" exact component={InputForm} />
      </Switch>
    </Router>
  );
}

export default App;
