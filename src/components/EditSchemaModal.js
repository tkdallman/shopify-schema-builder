import React, { Component } from "react";
import { Modal } from "@shopify/polaris";
import PropTypes from "prop-types";
import EditSchemaForm from './EditSchemaForm';
import { removeExtraneous } from './helpers';
const sections = require("../sections.json");

class EditSchemaModal extends Component {

  static propTypes = {
    updateSchemaItem: PropTypes.func,
    deleteSchemaItem: PropTypes.func,
    modalActive: PropTypes.bool,
    handleModalChange: PropTypes.func,
    schemaItemTriggered: PropTypes.object,
    schemaItemTriggeredIndex: PropTypes.number,
  };

  deleteItem = () => {
    const { deleteSchemaItem, handleModalChange, schemaItemTriggeredIndex } = this.props;
    deleteSchemaItem(schemaItemTriggeredIndex);
    handleModalChange(schemaItemTriggeredIndex);
  }

  updateAndClose = (inputs) => {
    const updatedSchemaItem = {  ...this.props.schemaItemTriggered };
    const schemaItemProperties = [ 'type', ...Object.keys(sections[updatedSchemaItem.type])];
    const schemaItemWithoutExtraneous = removeExtraneous(updatedSchemaItem, schemaItemProperties);

    if (schemaItemWithoutExtraneous.type === 'radio' && schemaItemWithoutExtraneous.options) {
      schemaItemWithoutExtraneous.options = schemaItemWithoutExtraneous.options.map(option => {
        return removeExtraneous(option, ['value', 'label']);
      });
    }

    this.props.updateSchemaItem(this.props.schemaItemTriggeredIndex, schemaItemWithoutExtraneous);
    this.props.handleModalChange(this.props.schemaItemTriggeredIndex);
  }
  
  render() {

    return (
      <div>
        <Modal
          open={this.props.modalActive}
          onClose={this.props.handleModalChange}
          title="Edit schema section"
          primaryAction={{
            content: "Confirm changes",
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
