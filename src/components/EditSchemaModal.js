import React, { Component } from "react";
import { Modal } from "@shopify/polaris";
import EditSchemaForm from './EditSchemaForm';
import { removeExtraneous } from './helpers';
const sections = require("../sections.json");

class EditSchemaModal extends Component {

  deleteItem = () => {
    this.props.deleteSchemaItem(this.props.schemaItemTriggeredId);
    this.props.handleModalChange(this.props.schemaItemTriggeredId);
  }

  updateAndClose = (inputs) => {
    const updatedSchemaItem = {  ...this.props.schemaItemTriggered };
    const schemaItemProperties = [ 'type', ...Object.keys(sections[updatedSchemaItem.type])];
    const schemaItemWithoutExtraneous = removeExtraneous(updatedSchemaItem, schemaItemProperties);

    if (schemaItemWithoutExtraneous.type === 'radio') {
      schemaItemWithoutExtraneous.options = schemaItemWithoutExtraneous.options.map(option => {
        return removeExtraneous(option, ['value', 'label']);
      });
      console.log(schemaItemWithoutExtraneous);
    }
   

    this.props.updateSchemaItem(this.props.schemaItemTriggeredId, schemaItemWithoutExtraneous);
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
              updateSchemaItem={this.props.updateSchemaItem}
              schemaItemTriggeredId={this.props.schemaItemTriggeredId}
              schemaItemTriggered={this.props.schemaItemTriggered}
              updateAndClose={this.updateAndClose}
              handleChange={this.props.handleChange}
            />
          </Modal.Section>
        </Modal>
      </div>
    );
  }
}

export default EditSchemaModal;
