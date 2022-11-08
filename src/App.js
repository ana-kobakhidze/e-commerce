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
    return (
      <Router>
        <div className="app">
        <Header client={this.props.client} />
        <Routes>
        <Route path={"/"} element={<PLP client={this.props.client}/>}/>
        <Route path="/:tabName" element={<PLP client={this.props.client}/>}/>
        <Route path="/:tabName/:productId" element={<PDP client={this.props.client}/>} />
        <Route path="/cart" element={<CART />} />

    </Routes>

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
