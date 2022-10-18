import React, { Component } from "react";
import { gql } from "@apollo/client";
import { connect } from "react-redux";

import styles from "./CURRENCY.module.css";
import getSymbolFromCurrency from "currency-symbol-map";

const DATA_QUERY = gql`
  query {
    currencies{
      label
      symbol
    }
  }
`;

class Currency extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: undefined
    };
    this.arrowClickHandler = this.arrowClickHandler.bind(this);
    this.closeClickHandler = this.closeClickHandler.bind(this);
  }

  async componentDidMount() {
    const { client } = this.props;
    const { data } = await client.query({ query: DATA_QUERY, variables: {} });
    const { currencies } = data;

    this.setState({
      currencies: currencies,
    });
  }

  arrowClickHandler() {
    if (!this.props.currencyDisable) {
      const { toggleDropDown } = this.props;
      this.props.toggleDropDownButton(!toggleDropDown);
    }
  }

  closeClickHandler() {
    this.props.toggleDropDownButton(false);
  }

  clickedCurrencyHandler(currency) {
    let symbol =
      currency === "AUD"
        ? "A" + getSymbolFromCurrency(currency)
        : getSymbolFromCurrency(currency);

    this.props.currentCurrencyIcon(symbol);
    this.props.toggleDropDownButton(false);
  }

  render() {
    const { currencies } = this.state;
    const { toggleDropDown } = this.props;

    let dropDown = [];
    if (toggleDropDown)
      currencies.map((element, index) => {
        return dropDown.push(
          <p
            className={styles.DropDownElements}
            key={index}
            onClick={() => this.clickedCurrencyHandler(element)}
          >
            {element === "AUD"
              ? "A" + getSymbolFromCurrency(element) + " " + element
              : getSymbolFromCurrency(element) + " " + element}
          </p>
        );
      });

    return (
      <div>
        <p className={styles.Currency} onClick={this.arrowClickHandler}>
          {this.props.currency}
        </p>
        <svg
          onClick={this.arrowClickHandler}
          className={styles.DownArrow}
          width="9"
          height="5"
          viewBox="0 0 8 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 0.5L4 3.5L7 0.5"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {this.props.showModal === false && (
          <div className={styles.Background} onClick={this.closeClickHandler}>
            <div className={styles.DropDownBackground}>{dropDown}</div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    currencyDisable: state.currencyDisable,
    toggleDropDown: state.toggleDropDown,
    showModal: state.showModal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    currentCurrencyIcon: (id) => {
      dispatch({ type: "CHANGE_ICON", id: id });
    },
    toggleDropDownButton: (event) => {
      dispatch({ type: "CLOSE_DROPDOWN", toggle: event });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Currency);
