import React, { Component } from "react";
import { connect } from "react-redux";
import withRouter from "../HOC/WithRouter";
import styles from "./Modal.module.css";


class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
    };

    this.incrementHandler = this.incrementHandler.bind(this);
    this.decrementHandler = this.decrementHandler.bind(this);
  }

  componentDidUpdate() {
    this.state.redirect && this.redirectButtonHandler();
    this.props.orderData.length < 1 && this.redirectButtonHandler()
  }

  componentWillUnmount() {
    if ( this.props.orderData.length < 1 ) this.props.saveOrderData([]);
  }
  saveOrder = (updatedOrderData) => {
    localStorage.setItem("order", JSON.stringify(updatedOrderData));
    this.props.saveOrderData(updatedOrderData);
  };

  incrementHandler = (id) => {
    const { orderData } = this.props;
    const updatedOrderData = orderData.map((product) => {
      if (product.id === id) {
        return { ...product, count: product.count + 1 };
      } else {
        return { ...product };
      }
    });

     this.saveOrder(updatedOrderData);
  };

  decrementHandler = (id, attrValue) => {
    const { orderData } = this.props;
    const updateOrderData = orderData.map((product) => {
      if (product.id === id && product.count > 1) {
        return { ...product, count: product.count - 1 };
      } else if (product.id === id && product.count === 1) {
        return { ...product, count: 0 };
      } else {
        return { ...product };
      }
    });
    this.saveOrder(updateOrderData);

    orderData.forEach((product) => {
      if (product.id === id && product.count === 1) {
        this.deleteButtonHandler(attrValue);
      }
    });
    if(!this.props.showModal) {document.body.style.overflow = "auto"};
  };
  deleteButtonHandler = (selectedAttr) => {
    const { orderData } = this.props;
    const newArr = orderData.filter((p) => p.attrValue !== selectedAttr);
    this.saveOrder(newArr);
  };

  getProductFromState = (id) => {
    return this.props.orderData.find((p) => p.id === id);
  };

  closeModal = (event) => {
    let modal = document.getElementsByClassName("Modal_Modal__k5zJr")[0];
    let frame = document.getElementsByClassName("Modal_BtnCheckOut__W1yZQ")[0];
    document.body.style.overflow = "auto";
    if (event.target === modal || event.target === frame) {
      this.props.displayModal(false);
      this.props.disableCurrencyButton(false);
    }
  };

  redirectButtonHandler = () => {
    this.setState({ redirect: true });
    this.props.displayModal(false);
    this.props.navigate("/cart");
  };

  render() {
    let itemList = [];
    const { orderData } = this.props;
    this.props.orderQuantity < 1 && this.props.displayModal();
      orderData.forEach((product, index) => {
        itemList.push(
          <div className={styles.OrderList} key={index}>
            <div className={styles.LeftRow}>
              <p className={styles.NameOfBrand}>{product.brand}</p>
              <p className={styles.NameOfProduct}>{product.name}</p>
              <p className={styles.PriceOfProduct}>
                {product.prices.map((price) => {
                  let currentPriceCurrency;
                  if (price.currency.symbol === this.props.currency) {
                    currentPriceCurrency = this.props.currency + price.amount;
                  }
                  return currentPriceCurrency;
                })}
              </p>

              {product.attributes &&
                product.attributes.map((attribute) => {
                  let attributeRenderableItems = [];
                  const renderableItems = attribute.items.map((item, index) => {
                    return (
                      <button
                        className={
                          item.isSelected && attribute.type === "swatch"
                            ? styles.SelectedColorAttrBox
                            : !item.isSelected && item.value === "#FFFFFF"
                            ? styles.WhiteBox
                            : !item.isSelected && attribute.type === "swatch"
                            ? styles.ColorAttrBox
                            : !item.isSelected && attribute.type !== "swatch"
                            ? styles.AttrBox
                            : styles.SelectedAttrBox
                        }
                        key={index}
                        style={{ backgroundColor: item.value }}
                      >
                        {attribute.type === "swatch" ? null : item.value}
                      </button>
                    );
                  });
                  attributeRenderableItems.push(
                    <div className={styles.AttributesWraper} key={index}>
                      <p className={styles.AttributeName}>
                        {attribute.name + ":"}
                      </p>
                      <div className={styles.AttributesBoxWraper}>
                        {renderableItems}
                      </div>
                    </div>
                  );
                  return attributeRenderableItems;
                })}
            </div>
            <div className={styles.MiddleRow}>
              <div
                className={styles.Increment}
                onClick={() => this.incrementHandler(product.id)}
              ></div>
              <p className={styles.Counter}>{product.count}</p>
              <div
                className={styles.Substract}
                onClick={() =>
                  this.decrementHandler(product.id, product.attrValue)
                }
              ></div>
            </div>

            <div className={styles.RightRow}>
              <img
                className={styles.ProductGallery}
                src={product.gallery[product.currentPosition]}
                alt="product"
              />
            </div>
          </div>
        );
      });

    let priceArray = [];
    if (orderData && orderData.length > 0)
      orderData.forEach((product) => {
        product.prices.map((price) => {
          if (price.currency.symbol === this.props.currency) {
            priceArray.push(price.amount * product.count);
          }
          return priceArray;
        });
      });

    let totalPrice;
    if (priceArray.length > 0) {
      const reducer = (accumulator, priceArray) => accumulator + priceArray;
      totalPrice = this.props.currency + priceArray.reduce(reducer).toFixed(2);
    }

    return (
      <div className={styles.Modal} onClick={(event) => this.closeModal(event)}>
        <div className={styles.ModalContent}>
        <div
          className={styles.ModalClose}
          onClick={(event) => this.closeModal(event)}
        />
          <div className={styles.ModalWindow}>
            <div className={styles.ModalHeader}>
              <h1 className={styles.CartHeadline}>My Bag,</h1>
              <p className={styles.ItemQuantity}>
                {this.props.orderQuantity} items
              </p>
            </div>
            <div className={styles.Content}>{itemList}</div>
            <div className={styles.ModalFooter}>
              <div className={styles.TotalPrice}>
                <p className={styles.Total}>Total:</p>
                <p className={styles.TotalNumber}>{totalPrice}</p>
              </div>
              <div className={styles.ButtonGroup}>
                <button
                  className={styles.BtnForCart}
                  onClick={() => this.redirectButtonHandler()}
                >
                  VIEW BAG
                </button>
                <button
                  className={styles.BtnCheckOut}
                  onClick={() => this.props.displayModal()}
                >
                  CHECK OUT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    showModal: state.showModal,
    orderData: state.orderData,
    tabName: state.tabName,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Modal));
