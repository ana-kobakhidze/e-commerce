import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,

} from "react-router-dom";
import { connect } from "react-redux";
import "./App.css";

import Header from "./HEADER/HEADER";
import PLP from "./PLP/PLP";
import PDP from "../src/PDP/PDP";
import CART from "../src/CART/CART";

class App extends Component {
  render() {
    console.log(this.props.tabName)
    return (
      <Router>
        <div className="app">
        <Header client={this.props.client} />
        <Routes>
        <Route path={"/"} element={<PLP client={this.props.client}/>}/>
        <Route path="/:tabName" element={<PLP client={this.props.client}/>}/>
        {/* <Route path={"/" + this.props.tabName} element={<PLP client={this.props.client}/>}/> */}
        <Route path="/:tabName/:productId" element={<PDP client={this.props.client}/>} />
        {/* <Route path={"/" + this.props.tabName + this.props.productId} element={<PDP client={this.props.client}/>} /> */}
        <Route path="/cart" element={<CART />} />

    </Routes>
          {/* <Header client={this.props.client} />
          <Switch>
            <Route path="/"
              render = { () => {
                return this.props.cartClick === "" || this.props.cartClick === "TAB_IS_CLICKED" ? (
                  ((<Redirect to={"/" + this.props.tabName} />),
                  (<CATEGORY client={this.props.client} />))
                ) 
                : this.props.cartClick === "ADD_TO_CART" || this.props.cartClick === "CART_ICON" ? (
                  ((<Redirect to="/cart" />), (<CART />))
                ) 
                : this.props.cartClick === "PRODUCT_PAGE" ? (
                  ((
                    <Redirect
                      to={"/" + this.props.tabName + this.props.productId}
                    />
                  ),
                  (<PDP client={this.props.client} />))
                ) 
                : (
                  <PLP client={this.props.client} />
                );
              }}
            />
          </Switch> */}
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
