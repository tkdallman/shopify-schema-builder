import React, { Component } from "react";
import { AppProvider } from "@shopify/polaris";
import '@shopify/polaris/styles.css';
import PageLayout from './PageLayout';

const arrayMove = require('array-move');

class App extends Component {
  state = {
    schemaItems: [],
  };

  addSchemaItem = schemaItem => {
    const schemaItems = [ ...this.state.schemaItems ];
    schemaItems.push(schemaItem);
    this.setState({ schemaItems });
  };
  
  moveSchemaItem  = (index, destination) => {
    const schemaItems = [ ...this.state.schemaItems ];
    const newSchemaItems = arrayMove(schemaItems, index, destination);
    this.setState({ schemaItems: newSchemaItems });
  }

  updateSchemaItem = (index, updatedSchemaItem) => {
    const schemaItems = [ ...this.state.schemaItems ];
    schemaItems[index] = updatedSchemaItem;
    schemaItems[index].options = updatedSchemaItem.options;
    this.setState({ schemaItems });
  };

  deleteSchemaItem = index => {
    const schemaItems = [ ...this.state.schemaItems ];
    schemaItems.splice(index, 1);
    this.setState({ schemaItems: schemaItems });
  };

  render() {
    return (
      <AppProvider>
        <PageLayout
          schemaItems={this.state.schemaItems}
          addSchemaItem={this.addSchemaItem}
          updateSchemaItem={this.updateSchemaItem}
          deleteSchemaItem={this.deleteSchemaItem}
          moveSchemaItem={this.moveSchemaItem}
        />
      </AppProvider>
    );
  }
}

export default App;