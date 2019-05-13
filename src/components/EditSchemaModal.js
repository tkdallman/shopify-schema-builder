import React, { Component } from "react";
import { Modal } from "@shopify/polaris";
import EditSchemaForm from './EditSchemaForm';

const sections = require("../sections.json");

class EditSchemaModal extends Component {

  state = {
    changedSettings: {},
  };

  deleteItem = () => {
    this.props.deleteSchemaItem(this.props.schemaItemTriggeredId);
    this.props.handleModalChange(this.props.schemaItemTriggeredId);
  }

  handleChange = (input, value) => {
    const settings = {  ...this.props.schemaItemTriggered, ...this.state.changedSettings };
    settings[input] = value;
    this.setState({ changedSettings: settings });
  }

  updateAndClose = (inputs) => {
    const updatedSchemaItem = {
      ...this.props.schemaItems[this.props.schemaItemTriggeredId],   
      ...this.state.changedSettings,
    };
    const schemaItemWithoutExtraneous = { type: updatedSchemaItem.type };
    const schemaItemProperties = Object.keys(sections[updatedSchemaItem.type]);

    schemaItemProperties.forEach(property => { 
      if (updatedSchemaItem[property]) {
        schemaItemWithoutExtraneous[property] = updatedSchemaItem[property];
      }
    });      

    this.props.updateSchemaItem(this.props.schemaItemTriggeredId, schemaItemWithoutExtraneous);
    this.setState(({ changedSettings }) => ({ changedSettings: {} })); 
    this.props.handleModalChange(this.props.schemaItemTriggeredId);
  }
  
  render() {
    return (
      <div>
        <Modal
          open={this.props.modalActive}
          onClose={this.props.handleModalChange}
          title="Add schema section"
          primaryAction={{
            content: "Finished",
            onAction: this.updateAndClose
          }}
          secondaryActions={[
            {
              content: "Delete Item",
              onAction: this.deleteItem
            }
          ]}
        >
          <Modal.Section>
            <EditSchemaForm 
              addSchemaItem={this.props.addSchemaItem} 
              updateSchemaItem={this.props.updateSchemaItem}
              schemaItemTriggeredId={this.props.schemaItemTriggeredId}
              schemaItemTriggered={this.props.schemaItemTriggered}
              schemaItems={this.props.schemaItems}
              itemsToChange={this.itemsToChange}
              removeProperty={this.removeProperty}
              changedSettings={this.state.changedSettings}
              updateAndClose={this.updateAndClose}
              handleChange={this.handleChange}
            />
          </Modal.Section>
        </Modal>
      </div>
    );
  }
}

export default EditSchemaModal;
