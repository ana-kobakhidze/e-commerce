import React, { Component } from "react";
import { gql } from "@apollo/client";
import { connect } from "react-redux";

import styles from "./CURRENCY.module.css";

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
    this.props.currentCurrencyIcon(currency.symbol);
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
              {element.label + '  ' + element.symbol}
          </p>
        );
      });

    return (
      <div className={styles.CurrenyWrapper}>
      <div className={toggleDropDown && styles.Modal} onClick={this.closeClickHandler}></div>
        <p className={styles.Currency} onClick={this.arrowClickHandler}>
          {this.props.currency}
        </p>
        
        <div className={toggleDropDown ? styles.DownArrow : styles.UpArrow} onClick={this.arrowClickHandler}></div>

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
