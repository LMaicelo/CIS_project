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
          <InputForm {...props} products={true} categories={false} brands={false}/>
        )} />
        <Route path="/category-form" render={(props) => (
          <InputForm {...props} products={false} categories={true} brands={false}/>
        )} />
        <Route path="/brand-form" render={(props) => (
          <InputForm {...props} products={false} categories={false} brands={true}/>
        )} />
      </Switch>
    </Router>
  );
}

export default App;
