import React, { Component } from "react";
import { AppProvider } from "@shopify/polaris";
import '@shopify/polaris/styles.css';
import PageLayout from './PageLayout';

class App extends Component {
  state = {
    schemaItems: {},
  };

  addSchemaItem = schemaItem => {
    const schemaItems = { ...this.state.schemaItems };
    schemaItems[`schemaItem${Date.now()}`] = schemaItem;
    this.setState({ schemaItems });
  };

  updateSchemaItem = (itemId, updatedSchemaItem) => {
    const schemaItems = { ...this.state.schemaItems };
    schemaItems[itemId] = updatedSchemaItem;
    this.setState({ schemaItems });
  };

  deleteSchemaItem = itemId => {
    const schemaItems = { ...this.state.schemaItems };
    const itemsWithoutDeleted = {};

    Object.keys(schemaItems).forEach(item => { 
      if (item !== itemId) {
        itemsWithoutDeleted[item] = schemaItems[item];
      } 
    }); 
    this.setState({ schemaItems: itemsWithoutDeleted });
  };

  render() {
    return (
      <AppProvider>
        <PageLayout
          schemaItems={this.state.schemaItems}
          addSchemaItem={this.addSchemaItem}
          updateSchemaItem={this.updateSchemaItem}
          deleteSchemaItem={this.deleteSchemaItem}
        />
      </AppProvider>
    );
  }
}

export default App;