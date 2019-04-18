import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import './App.css';
import './pages/SuburbPage.css'
import 'typeface-roboto';
import { Grid } from '@material-ui/core';

import Framework from './components/Framework';
import HomePage from "./pages/HomePage"
import CompareController from './components/CompareController';
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// export const BeamsContext = React.createContext({ suburb: null, suburb_state: null });

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      suburbs: [{ suburb: null, suburb_state: null }]
    };

    this.onSuburbSelect = this.onSuburbSelect.bind(this);

    this.history = createBrowserHistory();
  }

  onSuburbSelect = (city) => {
    console.log(`onSuburbSelect ${city}`);
    var { suburb, suburb_state } = this.parseCity(city);

    let suburbs = [{ suburb: suburb, suburb_state: suburb_state}];
    // Upload it
    const route = "/suburb/" + suburb + "/" + suburb_state;
    console.log("The route is", route);
    this.setState(() => ({ suburbs: suburbs}), () => this.history.push(route));
  };

  onSuburbCompare = (city) => {
    var { suburb, suburb_state } = this.parseCity(city);
    let suburbs = [this.state.suburbs[0], { suburb, suburb_state }];
    const route = "/compare/" + this.state.suburbs[0].suburb + "/" + this.state.suburbs[0].suburb_state + "/" + suburb + "/" + suburb_state;
    console.log("route on compare is", route);
    this.setState(() => ({ suburbs: suburbs}), () => this.history.push(route));
  }

  onStartOver = () => {
    this.setState(() => ({ suburbs: [{ suburb: null, suburb_state: null }] }), this.history.push("/"));
  };

  parseCity(city) {
    let re = /[A-Z]{3}|[A-Z]{2}/;
    var suburb_state = city.match(re)[0];
    var suburb = city.split(re)[0];
    suburb = suburb.slice(0, -1);
    return { suburb, suburb_state };
  }

  render() {
    console.log("app state", this.state);
    return (
      <div>
        <Framework onSuburbSelect={this.onSuburbSelect} onStartOver={this.onStartOver} />
        <Grid container className="ContentHolderMain" direction="column" justify="center" alignItems="center">
          <Grid item>
            <Router history={this.history}>
              <Switch>
                <Route exact path="/" render={() => <HomePage onSelect={this.onSuburbSelect} />} />
                <Route matches path="/suburb" render={() => <CompareController suburbs={this.state.suburbs} onStartOver={this.onStartOver} onSuburbCompare={this.onSuburbCompare} onSuburbSelect={this.onSuburbSelect} />} />
                <Route matches path="/compare" render={() => <CompareController suburbs={this.state.suburbs} onStartOver={this.onStartOver} onSuburbCompare={this.onSuburbCompare} onSuburbSelect={this.onSuburbSelect} />} />
              </Switch>
            </Router>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;

