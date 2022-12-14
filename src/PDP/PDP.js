import React, { Component } from "react";
import { gql } from "@apollo/client";
import { connect } from "react-redux";
import { Markup } from "interweave";

import withRouter from "../HOC/WithRouter";
import styles from "./PDP.module.css";
import Button from "../BUTTON/BUTTON";
import { fetchExtendedProductAsync } from "./Utils";

const PRODUCT_QUERY = gql`
  query ($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      prices {
        currency {
          label
          symbol
        }
        amount
      }
      brand
    }
  }
`;

class PDP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverImage: "",
      imageClicked: false,
      allAttributeIsSelected: false,
    };
  }

  async componentDidMount() {
    const { client } = this.props;
    const product = await fetchExtendedProductAsync(
      client,
      this.props.productId,
      PRODUCT_QUERY
    );
    localStorage.setItem("productItem", JSON.stringify(product));
    this.props.saveProductData(product);
  }

  handleImageHover = (e) => {
    this.setState({ hoverImage: e });
    this.setState({ imageClicked: true });
  };

  attributeHandler = (parentId, attributeId) => {
    let product = this.props.product;
    const attributeParent = product.attributes.find(
      (parent) => parent.id === parentId
    );
    attributeParent.items.forEach((i) => {
      i.isSelected = i.id === attributeId;
      attributeParent.checked = true;
    });
    let allChecked = product.attributes.every(
      (attribute) => attribute.checked === true
    );
    this.setState({
      allAttributeIsSelected: allChecked,
    });
  };

  render() {
    const { imageClicked, hoverImage } = this.state;
    let product = this.props.product;

    const imageList = [];
    const mainImage = [];
    if (product) {
      imageList.push(
        product.gallery.map((image, index) => {
          return (
            <div key={product.id + index}>
              <img
                key={index}
                className={styles.ImageList}
                src={image}
                alt={product.id}
                onMouseOver={(e) => this.handleImageHover(e.currentTarget.src)}
              />
            </div>
          );
        })
      );
    }
    if (product) {
      mainImage.push(
        product.inStock ? (
          <img
            key={product.id}
            className={styles.MainImage}
            src={!imageClicked ? product.gallery[0] : hoverImage}
            alt={product.id}
          />
        ) : (
          <>
            <img
              key={product.id}
              className={styles.MainImage}
              src={!imageClicked ? product.gallery[0] : hoverImage}
              alt={product.id}
            />
            <div className={styles.mainImageOverlay}>
              <p>OUT OF STOCK</p>
            </div>
          </>
        )
      );
    }
    let renderableAttributes = [];
    if (product && product.attributes.length >= 1) {
      product.attributes.forEach((item, index) => {
        renderableAttributes.push(
          <p className={styles.Size} key={item.id + index}>
            {item.name.toUpperCase() + ":"}
          </p>,
          item.items.map((element, index) => {
            return (
              <button
                onClick={() => this.attributeHandler(item.id, element.id)}
                key={element.value + index}
                className={
                  element.isSelected && item.type === "swatch"
                    ? styles.SelectedColorAttrBox
                    : !element.isSelected && element.value === "#FFFFFF"
                    ? styles.WhiteBox
                    : !element.isSelected && item.type === "swatch"
                    ? styles.ColorAttrBox
                    : !element.isSelected && item.type !== "swatch"
                    ? styles.AttrBox
                    : styles.SelectedAttrBox
                }
                style={{ backgroundColor: element.value }}
              >
                {item.type === "swatch" ? null : element.value}
              </button>
            );
          })
        );
      });
    }

    let price = [];
    if (product) {
      product.prices.forEach((item, index) => {
        return (
          item.currency.symbol === this.props.currency &&
          price.push(
            <div key={index + item.amount}>
              <p className={styles.Price}>PRICE:</p>
              <p className={styles.PriceCurrency}>
                {this.props.currency + item.amount}
              </p>
            </div>
          )
        );
      });
    }
    return (
      <div className={styles.PdpWrapper}>
        <div className={styles.List}>{imageList}</div>
        <div className={styles.Main}>{mainImage}</div>
        {product && (
          <>
            <div className={styles.RightBar}>
              <h3 className={styles.Brand}>{product.brand}</h3>
              <h5 className={styles.Name}>{product.name}</h5>
              {renderableAttributes}
              {price}

              <Button
                styleButton={
                  product.inStock &&
                  product.attributes.length >= 1 &&
                  this.state.allAttributeIsSelected
                    ? styles.ActiveButton
                    : product.inStock &&
                      product.attributes.length < 1 &&
                      !this.state.allAttributeIsSelected
                    ? styles.ActiveButton
                    : styles.DisableButton
                }
                text="ADD TO CART"
                product={product}
              ></Button>

              <div className={styles.Description}>
                <Markup content={product.description} />
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    productId: state.productId,
    product: state.product,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    saveProductData: (product) => {
      dispatch({ type: "SAVE_PRODUCT_DATA", data: product });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PDP));
