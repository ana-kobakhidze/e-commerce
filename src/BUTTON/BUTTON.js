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
      let attrValue = [];
      this.getAttributeValues(pdpData, attrValue);
      storedOrder.push({ ...pdpData, attrValue: attrValue });
    } else {
      let storedItem = [];
      this.getSelectedAttributes(storedOrder[storedProductIndex], storedItem);
      let newItem = [];
      this.getSelectedAttributes(pdpData, newItem);
      if (this.checkAttributeEquality(storedItem, newItem)) {
        storedOrder[storedProductIndex] = pdpData;
      } else {
        let attrValue = [];
        this.getAttributeValues(pdpData, attrValue);
        storedOrder.push({ ...pdpData, attrValue: attrValue });
      }
    }
    this.props.saveOrderData(storedOrder);
    localStorage.setItem("order", JSON.stringify(storedOrder));
    this.setState({ redirect: true });
  };

  getAttributeValues(data, arr) {
    return data.attributes.forEach((attribute) => {
      attribute.items.forEach((item) => {
        if (item.isSelected) {
          arr.push(item.value);
        }
      });
    });
  }
  getSelectedAttributes(data, arr) {
    return data.attributes.forEach((attribute) => {
      attribute.items.forEach((item) => {
        arr.push(item.isSelected);
      });
    });
  }
  checkAttributeEquality(a, b) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to="/cart" replace={true} />;
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Button));
