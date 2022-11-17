import React, { Component } from "react";
import { gql } from "@apollo/client";
import styles from "./PLP.module.css";
import withRouter from "../HOC/WithRouter";
import { connect } from "react-redux";

const CATREGORY_QUERY = gql`
  query ($input: CategoryInput) {
    category(input: $input) {
      name
      products {
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
  }
`;

class Plp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryData: undefined,
      mouseEnter: true,
    };
  }
  async componentDidMount() {
    const { tabName } = this.props;
    const { client } = this.props;
    const { data } = await client.query({
      query: CATREGORY_QUERY,
      variables: {
        input: {
          title: tabName,
        },
      },
    });
    let { category } = data;
    this.props.currentTabName(category.name);
    this.setState({ categoryData: category });
  }

  async componentDidUpdate() {
    const { categoryData } = this.state;
    if (categoryData && categoryData.name !== this.props.tabName) {
      const { client } = this.props;
      const { data } = await client.query({
        query: CATREGORY_QUERY,
        variables: {
          input: {
            title: this.props.tabName,
          },
        },
      });
      let { category } = data;
      this.setState({ categoryData: category });
    }
  }
  
  handleClick(id) {
    this.setState({ mouseEnter: true });
    localStorage.setItem("productId", JSON.stringify(id));
    this.props.currentProductId(id);
    this.props.navigate("/" + this.props.tabName + "/" + id)

  }
  handleIconClick(id) {
    const { categoryData } = this.state;
    this.setState({ mouseEnter: false });
      const result = categoryData.products.forEach(product => {
      if(product.id === id && product.attributes.length === 0){
        let storedOrder = JSON.parse(localStorage.getItem("order")) || [];
        storedOrder.push({...product, count: 1, currentPosition: 0});
        this.props.saveOrderData(storedOrder);
        localStorage.setItem("order", JSON.stringify(storedOrder));
        return this.props.navigate("/cart");
      }else{
       return this.props.navigate("/" + this.props.tabName + "/" + id)
      }

    })
    return result;

  }

  handleMouseEnter(id) {
    this.props.currentProductId(id);
  }

  handleMouseLeave() {
    this.props.currentProductId("");
  }

  render() {
    const { categoryData } = this.state;

    let categoryList = [];
    let categoryTitle = [];
    if (categoryData) {
      categoryTitle.push(
        <h1 className={styles.CategoryTitle} key={categoryData.name}>
          {categoryData.name}
        </h1>
      );

      categoryList.push(
        categoryData.products.map((item, index) => {
          return (
            <div
              className={styles.ProductList}
              key={index}
              onMouseEnter={() => this.handleMouseEnter(item.id)}
              onMouseLeave={() => this.handleMouseLeave()}
            >
              <li className={styles.ListWraper} key={item.id}>
                {item.inStock ? (
                  <div>
                    <img
                      src={item.gallery[0]}
                      alt={item.name}
                      onClick={() => this.handleClick(item.id)}
                    />
                    {this.props.productId === item.id && (
                      <div
                        className={styles.CartIcon}
                        onClick={() => this.handleIconClick(item.id)}
                      >
                        <div className={styles.CartCircle} />
                         <div className={styles.EmptyCart}></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <img src={item.gallery[0]} alt={item.name} />
                    <div
                      className={styles.Overlay}
                      onClick={() => this.handleClick(item.id)}
                    >
                      <p>OUT OF STOCK</p>
                    </div>
                  </>
                )}

                <div
                  className={styles.ItemInfo}
                  onClick={() => this.handleClick(item.id)}
                >

                  <p className={styles.Name}>{item.brand + ' ' + item.name}</p>

                  <p className={styles.Price}>
                    {this.props.currency + item.prices[0].amount}
                  </p>
                </div>
              </li>
            </div>
          );
        })
      );
    }
    return (
    <div className={styles.CategoryBody}>
      {categoryTitle}
      <div className={styles.CategoryListWrapper}>
        {categoryList}
      </div>
    </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    tabName: state.tabName,
    productId: state.productId,
    orderData: state.orderData
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    currentTabName: (name) => dispatch({ type: "SAVE_TABNAME", tabName: name }),
    currentProductId: (id) => dispatch({ type: "SAVE_PRODUCT_ID", id: id }),
    saveOrderData: (data) => dispatch({type:"SAVE_ORDER_DATA", data: data})
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Plp));
