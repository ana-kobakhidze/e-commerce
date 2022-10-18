import React, { Component } from "react";
import { connect } from "react-redux";

import styles from "./HEADER.module.css";
import CategoryLinks from "./Navigation/CATEGORYLINKS";
import Currency from "../CURRENCY/CURRENCY";
import Modal from "../MODAL/MODAL";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderData: []
    };
    this.modalClickHandler = this.modalClickHandler.bind(this);
  }

  componentDidMount() {
    this.setState({ orderData: this.props.orderData });
  }

  saveOrder(updatedOrder) {
    this.setState({ orderData: updatedOrder });
    localStorage.setItem("order", JSON.stringify(updatedOrder));
    this.props.saveOrderData(updatedOrder);
  }

  componentDidUpdate(prevProps) {
    let updatedOrder = this.props.orderData;
    if (prevProps !== this.props) {
      this.saveOrder(updatedOrder);
    }
  }

  modalClickHandler() {
    if (this.props.orderData.length >= 1) {
      this.props.displayModal(true);
      if (this.props.toggleDropDown) {
        this.props.toggleDropDownButton(false);
      }
      this.props.disableCurrencyButton(true);
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
        <CategoryLinks client={this.props.client} />
        <div className={styles.BrandIcon}>
          <svg
            className={styles.IconBack}
            width="29"
            height="25"
            viewBox="0 0 29 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M28.0222 23.6646C28.0494 23.983 27.8009 24.2566 27.4846 24.2566H1.46924C1.15373 24.2566 0.90553 23.9843 0.931564 23.6665L2.7959 0.912269C2.8191 0.629618 3.05287 0.412109 3.33372 0.412109H25.5426C25.8226 0.412109 26.0561 0.628527 26.0801 0.910361L28.0222 23.6646Z"
              fill="#1DCF65"
            />
          </svg>

          <svg
            className={styles.IconFront}
            width="33"
            height="30"
            viewBox="0 0 33 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32.0988 28.6014C32.1313 28.9985 31.8211 29.339 31.4268 29.339H1.59438C1.2009 29.339 0.890922 29.0002 0.922082 28.6037L3.06376 1.34718C3.09168 0.992702 3.38426 0.719727 3.73606 0.719727H29.1958C29.5468 0.719727 29.8391 0.991612 29.868 1.34499L32.0988 28.6014Z"
              fill="url(#paint0_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="25.8733"
                y1="25.3337"
                x2="7.51325"
                y2="3.9008"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#52D67A" />
                <stop offset="1" stopColor="#5AEE87" />
              </linearGradient>
            </defs>
          </svg>

          <svg
            className={styles.IconArrow}
            width="15"
            height="10"
            viewBox="0 0 15 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.92324 9.69529C4.04024 9.69529 0.881348 5.86314 0.881348 1.15278C0.881348 0.90747 1.07815 0.708496 1.32109 0.708496C1.56403 0.708496 1.76084 0.907334 1.76084 1.15278C1.76084 5.3732 4.52531 8.80672 7.92337 8.80672C11.3214 8.80672 14.0859 5.3732 14.0859 1.15278C14.0859 0.90747 14.2827 0.708496 14.5257 0.708496C14.7686 0.708496 14.9654 0.907334 14.9654 1.15278C14.9653 5.86314 11.8062 9.69529 7.92324 9.69529Z"
              fill="white"
            />
          </svg>

          <svg
            className={styles.IconArrowHead}
            width="7"
            height="5"
            viewBox="0 0 7 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.25807 4.03371C1.14557 4.03371 1.03307 3.99037 0.947147 3.90356C0.77543 3.73007 0.77543 3.44878 0.947147 3.2753L3.22601 0.972924C3.30843 0.889655 3.42025 0.842773 3.53693 0.842773C3.65362 0.842773 3.76544 0.889519 3.84786 0.972924L6.10446 3.25295C6.27618 3.42643 6.27618 3.70772 6.10446 3.88121C5.93275 4.05456 5.65433 4.0547 5.48261 3.88121L3.5368 1.91546L1.569 3.90356C1.48307 3.99037 1.37057 4.03371 1.25807 4.03371Z"
              fill="white"
            />
          </svg>
        </div>

        <div className={styles.Actions}>
          <Currency client={client} />
          <div className={styles.Cart} onClick={this.modalClickHandler}>
            <svg
              className={styles.Basket}
              width="20"
              height="14"
              viewBox="0 0 20 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.5613 3.87359C19.1822 3.41031 18.5924 3.12873 17.9821 3.12873H5.15889L4.75914 1.63901C4.52718 0.773016 3.72769 0.168945 2.80069 0.168945H0.653099C0.295301 0.168945 0 0.450523 0 0.793474C0 1.13562 0.294459 1.418 0.653099 1.418H2.80069C3.11654 1.418 3.39045 1.61936 3.47434 1.92139L6.04306 11.7077C6.27502 12.5737 7.07451 13.1778 8.00152 13.1778H16.4028C17.3289 13.1778 18.1507 12.5737 18.3612 11.7077L19.9405 5.50575C20.0877 4.941 19.9619 4.33693 19.5613 3.87365L19.5613 3.87359ZM18.6566 5.22252L17.0773 11.4245C16.9934 11.7265 16.7195 11.9279 16.4036 11.9279H8.00154C7.68569 11.9279 7.41178 11.7265 7.32789 11.4245L5.49611 4.39756H17.983C18.1936 4.39756 18.4042 4.49824 18.5308 4.65948C18.6567 4.81994 18.7192 5.0213 18.6567 5.22266L18.6566 5.22252Z"
                fill="#43464E"
              />
            </svg>
            <svg
              className={styles.WheelOne}
              width="5"
              height="6"
              viewBox="0 0 5 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.44437 0.981402C1.2443 0.981402 0.254883 1.92762 0.254883 3.07511C0.254883 4.2226 1.24439 5.16882 2.44437 5.16882C3.64445 5.1696 4.63386 4.22339 4.63386 3.07571C4.63386 1.92804 3.64436 0.981201 2.44437 0.981201V0.981402ZM2.44437 3.90108C1.9599 3.90108 1.58071 3.53847 1.58071 3.07519C1.58071 2.61191 1.9599 2.24931 2.44437 2.24931C2.92885 2.24931 3.30804 2.61191 3.30804 3.07519C3.30722 3.5188 2.90748 3.90108 2.44437 3.90108Z"
                fill="#43464E"
              />
            </svg>

            <svg
              className={styles.WheelTwo}
              width="5"
              height="6"
              viewBox="0 0 5 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.68754 0.981445C1.48747 0.981445 0.498047 1.92766 0.498047 3.07515C0.498047 4.22264 1.48755 5.16886 2.68754 5.16886C3.88753 5.16886 4.87703 4.22264 4.87703 3.07515C4.85647 1.92837 3.88753 0.981445 2.68754 0.981445ZM2.68754 3.90112C2.20306 3.90112 1.82387 3.53852 1.82387 3.07523C1.82387 2.61195 2.20306 2.24935 2.68754 2.24935C3.17201 2.24935 3.55121 2.61195 3.55121 3.07523C3.55121 3.51884 3.15064 3.90112 2.68754 3.90112Z"
                fill="#43464E"
              />
            </svg>
          </div>

          {orderQuantity >= 1 && (
            <div
              className={styles.ProductCounter}
              onClick={this.modalClickHandler}
            >
              {orderQuantity.length === 1 ? (
                <p className={styles.NumberOfCounter}>{orderQuantity}</p>
              ) : (
                <p className={styles.NumberOfCounterPosition}>
                  {orderQuantity}
                </p>
              )}
            </div>
          )}
        </div>
        {this.props.showModal && <Modal orderQuantity={orderQuantity} />}
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
