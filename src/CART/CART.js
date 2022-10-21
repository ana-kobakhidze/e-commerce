import React, { Component } from "react";
import { connect } from "react-redux";

import styles from "./CART.module.css";
import getSymbolFromCurrency from "currency-symbol-map";

//TODO: Think about merging it with Modal.js
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: [],
    };

    this.attributeSelectionHandler = this.attributeSelectionHandler.bind(this);
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
    }
  }

  saveOrder = (updatedOrderData) => {
    localStorage.setItem("order", JSON.stringify(updatedOrderData));
    this.setState({ orderData: updatedOrderData });
    this.props.saveOrderData(updatedOrderData);
  };

  attributeSelectionHandler = (productId, attributeId, itemId) => {
    const { orderData } = this.state;
    //find attribute in object tree, go back and update each node
    const updatedOrderData = orderData.map((product) => {
      if (product.id === productId) {
        const updatedAttributes = product.attributes.map((attribute) => {
          if (attribute.id === attributeId) {
            const updatedItems = attribute.items.map((item) => {
              return { ...item, isSelected: item.id === itemId };
            });
            return { ...attribute, items: updatedItems };
          } else {
            return { ...attribute };
          }
        });
        return { ...product, attributes: updatedAttributes };
      } else {
        return { ...product };
      }
    });
    this.saveOrder(updatedOrderData);
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

  decrementHandler = (id) => {
    const { orderData } = this.state;
    const updatedOrderData = orderData.map((product) => {
      if (product.id === id && product.count > 1) {
        return { ...product, count: product.count - 1 };
      } else {
        return { ...product };
      }
    });
    this.saveOrder(updatedOrderData);
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
  deleteButtonHandler = (id) => {
    const { orderData } = this.state;
    const newArr = orderData.filter((item) => item.id !== id);
    this.saveOrder(newArr);
  };

  render() {
    let itemList = [];
    const { orderData } = this.state;

    if (orderData) {
      orderData.forEach((product, index) => {
        itemList.push(
          <div key={index}>
            <div className={styles.ItemListWraper}>
              <hr />
              <p className={styles.BrandName}>{product.brand}</p>
              <p className={styles.ItemName}>{product.name}</p>

              <p className={styles.ItemPrice}>
                {product.prices.map((price) => {
                  let currentPriceCurrency;
                  if (
                    price.currency === "AUD" &&
                    "A" + getSymbolFromCurrency(price.currency) ===
                      this.props.currency
                  ) {
                    currentPriceCurrency = this.props.currency + price.amount;
                  } else if (
                    price.currency !== "AUD" &&
                    getSymbolFromCurrency(price.currency) ===
                      this.props.currency
                  ) {
                    currentPriceCurrency = this.props.currency + price.amount;
                  }
                  return currentPriceCurrency;
                })}
              </p>

              {product.attributes &&
                product.attributes.map((attribute) => {
                  let attributeRenderableItems = [];
                  const renderableItems = attribute.items.map((item, index) => {
                    return item.isSelected ? (
                      <button
                        key={index}
                        className={
                          item.value[0] !== "#"
                            ? styles.SelectedAttrBox
                            : styles.colorAttrBox
                        }
                        onClick={() =>
                          this.attributeSelectionHandler(
                            product.id,
                            attribute.id,
                            item.id
                          )
                        }
                        style={{ backgroundColor: item.value }}
                      >
                        {item.value[0] === "#" ? null : item.value}
                      </button>
                    ) : (
                      <button
                        key={index}
                        className={
                          item.value[0] === "#"
                            ? styles.ColorAttrBoxSelected
                            : styles.attributeBoxOrg
                        }
                        onClick={() =>
                          this.attributeSelectionHandler(
                            product.id,
                            attribute.id,
                            item.id
                          )
                        }
                        style={{ backgroundColor: item.value }}
                      >
                        {item.value[0] === "#" ? null : item.value}
                      </button>
                    );
                  });
                  attributeRenderableItems.push(
                    <div
                      className={styles.CategoryAttributesWraper}
                      key={index}
                    >
                      <p className={styles.AttributesName}>
                        {attribute.name.toUpperCase() + ":"}
                      </p>
                      {renderableItems}
                    </div>
                  );
                  return attributeRenderableItems;
                })}

              <button
                className={styles.PlusBox}
                onClick={() => this.incrementHandler(product.id)}
              ></button>

              <svg
                className={styles.Vertical}
                width="1"
                height="17"
                viewBox="0 0 1 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.5 1V16"
                  stroke="#1D1F22"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                className={styles.Horizontal}
                width="17"
                height="1"
                viewBox="0 0 17 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 0.5H16"
                  stroke="#1D1F22"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className={styles.Count}>{product.count}</p>
              <button
                className={styles.MinusBox}
                onClick={() => this.decrementHandler(product.id)}
              ></button>
              <svg
                className={styles.HorizontalMinus}
                width="17"
                height="1"
                viewBox="0 0 17 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 0.5H16"
                  stroke="#1D1F22"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <img
                className={styles.ProductImage}
                src={product.gallery[product.currentPosition]}
                alt="product"
              />

              {product.gallery.length > 1 && (
                <svg
                  onClick={() => this.leftSliderHandler(product.id)}
                  className={styles.LeftArrow}
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 13L1 7L7 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {product.gallery.length > 1 && (
                <svg
                  className={styles.RightArrow}
                  onClick={() => this.rightSliderHandler(product.id)}
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 13L7 7L1 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <button
              className={styles.DeleteButton}
              onClick={() => this.deleteButtonHandler(product.id)}
            >
              X
            </button>
          </div>
        );
      });
    }

    return (
      <div>
        <h1 className={styles.CartTitle}>CART</h1>
        {itemList}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currency: state.currency,
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
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
