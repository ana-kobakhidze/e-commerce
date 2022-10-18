import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./REDUCER/rootReducer";
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

import "./index.css";
import App from "./App";

const store = createStore(rootReducer);
const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App client={client} />
      </ApolloProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
