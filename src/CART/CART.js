import React, { Component } from "react";
import { connect } from "react-redux";
import withRouter from "../HOC/WithRouter";

import styles from "./Cart.module.css";

//TODO: Think about merging it with Modal.js
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: null,
      count: undefined,
    };

    // this.attributeSelectionHandler = this.attributeSelectionHandler.bind(this);
    this.incrementHandler = this.incrementHandler.bind(this);
    this.decrementHandler = this.decrementHandler.bind(this);
    this.leftSliderHandler = this.leftSliderHandler.bind(this);
    this.rightSliderHandler = this.rightSliderHandler.bind(this);
  }

  componentDidMount() {
    this.setState({ orderData: this.props.orderData });
  }
  //needed because state can be mutated from modal window as well
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ orderData: this.props.orderData });
      if (this.state.orderData.length <= 0) {
        this.props.navigate("/" + this.props.tabName);
      }
    }
  }

  saveOrder = (updatedOrderData) => {
    localStorage.setItem("order", JSON.stringify(updatedOrderData));
    this.setState({ orderData: updatedOrderData });
    this.props.saveOrderData(updatedOrderData);
  };


  incrementHandler = (id) => {
    const { orderData } = this.state;
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
    const { orderData } = this.state;
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
        this.setState({ count: 1 });
        this.deleteButtonHandler(attrValue);
      }
    });
  };

  getProductFromState = (id) => {
    return this.props.orderData.find((p) => p.id === id);
  };

  leftSliderHandler = (id) => {
    const { orderData } = this.state;
    const updatedOrderData = orderData.map((product) => {
      if (product.id === id && product.currentPosition > 0) {
        return { ...product, currentPosition: product.currentPosition - 1 };
      } else {
        return { ...product };
      }
    });
    this.saveOrder(updatedOrderData);
  };

  rightSliderHandler = (id) => {
    const { orderData } = this.state;
    const updatedOrderData = orderData.map((product) => {
      if (
        product.id === id &&
        product.currentPosition < product.gallery.length - 2
      ) {
        return { ...product, currentPosition: product.currentPosition + 1 };
      } else {
        return { ...product };
      }
    });
    this.saveOrder(updatedOrderData);
  };

  deleteButtonHandler = (selectedAttr) => {
    const { orderData } = this.state;
    const newArr = orderData.filter((p) => p.attrValue !== selectedAttr);
    this.saveOrder(newArr);
  };
  orderHandler = () => {
    this.saveOrder([]);
  }

  render() {
    let itemList = [];
    const { orderData } = this.props;
    let tax = 0;
    let quantity = 0;
    let total = 0;
    if (orderData) {
      orderData.forEach((product, index) => {
        itemList.push(
          <div key={index}>
            <div className={styles.Product}>
              <hr />
              <div className={styles.ItemListWraper}>
                <div className={styles.LeftRow}>
                  <p className={styles.BrandName}>{product.brand}</p>
                  <p className={styles.ItemName}>{product.name}</p>

                  <p className={styles.ItemPrice}>
                    {product.prices.map((price) => {
                      let currentPriceCurrency;
                      if (price.currency.symbol === this.props.currency) {
                        currentPriceCurrency =
                          this.props.currency + price.amount;
                      }
                      return currentPriceCurrency;
                    })}
                  </p>

                  {product.attributes &&
                    product.attributes.map((attribute) => {
                      let attributeRenderableItems = [];
                      const renderableItems = attribute.items.map(
                        (item, index) => {
                          return (
                            <button
                              className={
                                item.isSelected && attribute.type === "swatch"
                                  ? styles.SelectedColorAttrBox
                                  : !item.isSelected &&
                                    item.value === "#FFFFFF"
                                  ? styles.WhiteBox
                                  : !item.isSelected &&
                                  attribute.type === "swatch"
                                  ? styles.ColorAttrBox
                                  : !item.isSelected &&
                                  attribute.type !== "swatch"
                                  ? styles.AttrBox
                                  : styles.SelectedAttrBox
                              }
                              key={index}
                              style={{ backgroundColor: item.value }}
                            >
                              {attribute.type === "swatch" ? null : item.value}
                            </button>
                          );
                        }
                      );
                      attributeRenderableItems.push(
                        <div
                          className={styles.CategoryAttributesWraper}
                          key={index}
                        >
                          <p className={styles.AttributesName}>
                            {attribute.name.toUpperCase() + ":"}
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

                  <p className={styles.Count}>{product.count}</p>

                  <div
                    className={styles.Substract}
                    onClick={() =>
                      this.decrementHandler(product.id, product.attrValue)
                    }
                  ></div>
                </div>
                <div className={styles.RightRow}>
                  <img
                    className={styles.ProductImage}
                    src={product.gallery[product.currentPosition]}
                    alt="product"
                  />
                  <div className={styles.ArrowWrapper}>
                    {product.gallery.length > 1 && (
                      <div
                        className={styles.LeftArrow}
                        onClick={() => this.leftSliderHandler(product.id)}
                      ></div>
                    )}

                    {product.gallery.length > 1 && (
                      <div
                        className={styles.RightArrow}
                        onClick={() => this.rightSliderHandler(product.id)}
                      ></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
    orderData.forEach(product => {
      quantity += product.count;
      product.prices.map((price) => {
        if (price.currency.symbol === this.props.currency) {
          total += price.amount * product.count;
        }
      });
      tax = 21/100 * total 
    })

    return (
      <div className={styles.CartWrapper}>
        <div className={styles.CartHeader}>
          <h1 className={styles.CartTitle}>CART</h1>
        </div>
        <div className={styles.CartContent}>
          {this.props.orderData ? itemList : null}
        </div>
        <div className={styles.CartFooter}>
          <hr/>
          <p>Tax 21%: <strong>{this.props.currency + tax.toFixed(2)}</strong></p>
          <p>Quantity: <strong>{quantity}</strong></p>
          <p className={styles.Total}>Total: <strong>{this.props.currency + total.toFixed(2)}</strong></p>
          <button onClick={() => this.orderHandler()}>ORDER</button>


        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    orderData: state.orderData,
    tabName: state.tabName,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    saveOrderData: (order) => {
      dispatch({ type: "SAVE_ORDER_DATA", data: order });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Cart));
