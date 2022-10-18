import { ACTION_TYPES } from "../Constants";

const initialState = {
  currency: "$",
  currencyDisable: false,
  toggleDropDown: false,
  showModal: false,
  orderData: JSON.parse(localStorage.getItem("order")) || [],
  tabName: "",
  cartClick: "",
  productId: ''
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.CHANGE_ICON: {
      return { ...state, currency: action.id };
    }
    case ACTION_TYPES.DISABLE_CURRENCY:{
      return { ...state, currencyDisable: action.disable}
    }
    case ACTION_TYPES.CLOSE_DROPDOWN: {

      return { ...state, toggleDropDown: action.toggle }
    }
    case ACTION_TYPES.SHOW_MODAL: {
      return { ...state, showModal: action.show };
    }
    case ACTION_TYPES.SHOW_ITEM_QUANTITY: {
      return { ...state, orderQuantity: action.quantity };
    }
    case ACTION_TYPES.SAVE_ORDER_DATA: {
      return { ...state, orderData: action.data };
    }
    case ACTION_TYPES.SAVE_TABNAME: {
      return { ...state, tabName: action.tabName };
    }
    case ACTION_TYPES.SAVE_PRODUCT_ID: {
      return { ...state, productId: action.id }
    }
    case ACTION_TYPES.SAVE_CARTICON_CLICK: {
      return { ...state, cartClick: action.clicked}
    }
    default:
      return state;
  }
}

export default rootReducer;
