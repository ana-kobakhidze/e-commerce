import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { connect } from "react-redux";
import "./App.css";

import Header from "./HEADER/HEADER";
import CATEGORY from "./CATEGORY/CATEGORY";



class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Header client={this.props.client} />
          <Switch>
            <Route
              path="/"
              render={() => {
                return this.props.cartClick === "" ||
                  this.props.cartClick === "TAB_IS_CLICKED" ? (
                  ((<Redirect to={"/" + this.props.tabName} />),
                  (<CATEGORY client={this.props.client} />))
                ) : this.props.cartClick === "ADD_TO_CART" ||
                  this.props.cartClick === "CART_ICON" ? (
                  ((<Redirect to="/cart" />))
                ) : this.props.cartClick === "PRODUCT_PAGE" ? (
                  ((
                    <Redirect
                      to={"/" + this.props.tabName + this.props.productId}
                    />
                  )
                  )
                ) : (
                  <CATEGORY client={this.props.client} />
                );
              }}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    tabName: state.tabName,
    productId: state.productId,
    cartClick: state.cartClick,
  };
};
export default connect(mapStateToProps)(App);
