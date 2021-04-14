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
        <Route path="/product-form" render={(props) => (
          <InputForm {...props} products={true} />
        )} />
        <Route path="/category-form" render={(props) => (
          <InputForm {...props} products={false} />
        )} />
      </Switch>
    </Router>
  );
}

export default App;
