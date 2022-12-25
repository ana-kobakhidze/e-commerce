import React, { Component } from "react";
import { connect } from "react-redux";

import styles from "./Header.module.css";
import CategoryLinks from "./Navigation/Category-links";
import Currency from "../Currency/Currency";
import Modal from "../Modal/Modal";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderData: [],
    };
    this.modalClickHandler = this.modalClickHandler.bind(this);
  }

  componentDidMount() {
    this.setState({ orderData: this.props.orderData });
  }
  componentDidUpdate(prevProps) {
    let updatedOrder = this.props.orderData;
    if (prevProps.orderData !== this.props.orderData) {
      this.saveOrder(updatedOrder);
    }
    if (this.props.showModal) {
      document.body.style.overflow = "hidden";
    }
  }
  componentWillUnmount() {
    if ( this.props.orderData.length < 1 ) this.props.saveOrderData([]);
  }

  saveOrder(updatedOrder) {
    this.setState({ orderData: updatedOrder });
    localStorage.setItem("order", JSON.stringify(updatedOrder));
    this.props.saveOrderData(updatedOrder);
  }

  modalClickHandler() {
    if (this.props.orderData.length >= 1 && this.props.showModal === false) {
      this.props.displayModal(true);
      if (this.props.toggleDropDown) {
        this.props.toggleDropDownButton(false);
      }
      this.props.disableCurrencyButton(true);
    } else {
      this.props.displayModal(false);
      document.body.style.overflow = "auto";
    }
  }

  render() {
    const { orderData } = this.state;
    const { client } = this.props;

    let productQuantityInOrder = [];
    if (orderData) {
      orderData.map((product) => {
        return productQuantityInOrder.push(product.count);
      });
    }
    let orderQuantity = "";
    if (productQuantityInOrder.length > 0) {
      const reducer = (accumulator, productQuantityInOrder) =>
        accumulator + productQuantityInOrder;
      const totalNumber = productQuantityInOrder.reduce(reducer);
      orderQuantity = totalNumber.toString();
    }

    return (
      <header className={styles.Header}>
        {this.props.showModal && <Modal orderQuantity={orderQuantity} />}
        <CategoryLinks client={this.props.client} />
        <div className={styles.BrandIcon}></div>

        <div className={styles.Actions}>
          <Currency client={client} />
          <div className={styles.Cart} onClick={this.modalClickHandler}></div>

          {orderQuantity >= 1 && (
            <div
              className={styles.ProductCounter}
              onClick={this.modalClickHandler}
            >
              {orderQuantity.length === 1 ? (
                <p className={styles.NumberOfCounter}>{orderQuantity}</p>
              ) : (
                <p className={styles.NumberOfCounter}>{orderQuantity}</p>
              )}
            </div>
          )}
        </div>
      </header>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    showModal: state.showModal,
    orderData: state.orderData,
    toggleDropDown: state.toggleDropDown,
    currencyDisable: state.currencyDisable,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    displayModal: (event) => {
      dispatch({ type: "SHOW_MODAL", show: event });
    },
    saveOrderData: (order) => {
      dispatch({ type: "SAVE_ORDER_DATA", data: order });
    },
    disableCurrencyButton: (event) => {
      dispatch({ type: "DISABLE_CURRENCY", disable: event });
    },
    toggleDropDownButton: (event) => {
      dispatch({ type: "CLOSE_DROPDOWN", toggle: event });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
