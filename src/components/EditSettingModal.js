import React, { Component } from "react";
import { Modal, Button } from "@shopify/polaris";
import PropTypes from "prop-types";
import EditSettingForm from './EditSettingForm';
import { removeExtraneous } from './helpers';
const sections = require("../sections.json");

class EditSettingModal extends Component {

  static propTypes = {
    updateSettingItem: PropTypes.func,
    deleteSettingItem: PropTypes.func,
    modalActive: PropTypes.bool,
    handleModalChange: PropTypes.func,
    settingItemTriggered: PropTypes.object,
    settingItemTriggeredIndex: PropTypes.number,
    blockTriggeredIndex: PropTypes.number,
  };

  deleteItem = () => {
    const { deleteSettingItem, handleModalChange, settingItemTriggeredIndex, blockTriggeredIndex } = this.props;
    const blockIndex = blockTriggeredIndex >= 0 ? blockTriggeredIndex : undefined;    
    deleteSettingItem(settingItemTriggeredIndex, blockTriggeredIndex);
    handleModalChange();
  }

  updateAndClose = () => {
    if (this.props.idError) return;
    const { settingItemTriggeredIndex, blockTriggeredIndex } = this.props;
    const updatedSettingItem = {  ...this.props.settingItemTriggered };
    const settingItemProperties = [ 'type', ...Object.keys(sections[updatedSettingItem.type])];
    const settingItemWithoutExtraneous = removeExtraneous(updatedSettingItem, settingItemProperties);

    if (settingItemWithoutExtraneous.type === 'radio' && settingItemWithoutExtraneous.options) {
      settingItemWithoutExtraneous.options = settingItemWithoutExtraneous.options.map(option => {
        return removeExtraneous(option, ['value', 'label']);
      });
    }
    const blockIndex = blockTriggeredIndex >= 0 ? blockTriggeredIndex : undefined;
    this.props.updateSettingItem(settingItemTriggeredIndex, settingItemWithoutExtraneous, blockIndex);
    this.props.handleModalChange(settingItemTriggeredIndex, blockIndex);
  }
  
  render() {
    return (
      <div>
        <Modal
          open={this.props.modalActive}
          onClose={this.props.handleModalChange}
          title="Edit setting section"
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
            <EditSettingForm 
              updateSettingItem={this.props.updateSettingItem}
              settingItemTriggeredId={this.props.settingItemTriggeredId}
              settingItemTriggered={this.props.settingItemTriggered}
              updateAndClose={this.updateAndClose}
              handleChange={this.props.handleChange}
              idError={this.props.idError}
            />
          </Modal.Section>
        </Modal>
      </div>
    );
  }
}

export default EditSettingModal;
