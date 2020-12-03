import React, { Component } from "react";
import { Provider } from "react-redux";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/styles.css";
import PageLayout from "./PageLayout";
import store from "../store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppProvider>
          <PageLayout />
        </AppProvider>
      </Provider>
    );
  }
}

export default App;
