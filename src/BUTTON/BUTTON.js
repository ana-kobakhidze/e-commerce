import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import withRouter from "../HOC/WithRouter";
import { connect } from "react-redux";

class Button extends Component {
  state = {
    redirect: false,
  };

  clickHandler = (pdpData) => {
    let storedOrder = JSON.parse(localStorage.getItem("order")) || [];
    const storedProductIndex = storedOrder.findIndex(
      (p) => p.id === pdpData.id
    );

    if (storedProductIndex === -1 && pdpData) {
      storedOrder.push(pdpData);
    } else {
      storedOrder[storedProductIndex] = pdpData;
    }
    this.props.saveOrderData(storedOrder);
    localStorage.setItem("order", JSON.stringify(storedOrder));
    console.log(storedOrder)
    this.setState({ redirect: true });
  };

  render() {
    if (this.state.redirect) {
      return  <Navigate to="/cart" replace={true} />;
    }
    return (
      <button
        className={this.props.styleButton}
        onClick={() => this.clickHandler(this.props.product)}
      >
        {this.props.text}
      </button>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    orderData: state.orderData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveOrderData: (order) => {
      dispatch({ type: "SAVE_ORDER_DATA", data: order });
    },
    currentCartClick: (event) =>
      dispatch({ type: "SAVE_CARTICON_CLICK", clicked: event }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Button));
