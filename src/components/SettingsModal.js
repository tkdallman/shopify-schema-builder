import React, { Component } from 'react';
import { Modal } from "@shopify/polaris";
import PropTypes from "prop-types";
import AddSettingForm from "./AddSettingForm";
import EditSettingForm from './EditSettingForm';
import { removeExtraneous } from './helpers';


const sections = require("../sections.json");

class SettingsModal extends Component {

  deleteItem = () => {
    const { deleteSettingItem, handleModalChange, settingItemTriggeredIndex, blockTriggeredIndex } = this.props;
    const blockIndex = blockTriggeredIndex >= 0 ? blockTriggeredIndex : undefined;    
    deleteSettingItem(settingItemTriggeredIndex, blockTriggeredIndex);
    this.props.handleClose(settingItemTriggeredIndex, blockIndex);
  }
  
  updateAndClose = () => {
    if (this.props.idError) return;
    const { settingItemTriggeredIndex, blockTriggeredIndex, modalType, settings } = this.props;
    const blockIndex = blockTriggeredIndex >= 0 ? blockTriggeredIndex : undefined;

    if (modalType === 'edit') {
      const updatedSettingItem = {  ...this.props.settingItemTriggered };
      const settingItemProperties = [ 'type', ...Object.keys(sections[updatedSettingItem.type])];
      const settingItemWithoutExtraneous = removeExtraneous(updatedSettingItem, settingItemProperties);
    
      if (settingItemWithoutExtraneous.type === 'radio' && settingItemWithoutExtraneous.options) {
        settingItemWithoutExtraneous.options = settingItemWithoutExtraneous.options.map(option => {
          return removeExtraneous(option, ['value', 'label']);
        });
      }     
      this.props.updateSettingItem(settingItemTriggeredIndex, settingItemWithoutExtraneous, blockIndex);
    } else {
      const settingItem = {};
      const settingItemProperties = Object.keys(sections[settings.type]);

      Object.keys(settings)
        .filter(item => settingItemProperties.includes(item) || item === 'type')
        .forEach(item => { settingItem[item] = settings[item];
      });        
      this.props.addSettingItem(settingItem, blockIndex);
    }
    
    this.props.handleClose();
  }

  render() {

    const { modalActive, modalType, handleClose } = this.props;
    
    return (
      <Modal
      open={modalActive}
      onClose={handleClose}
      title={modalType === 'edit' ? 'Edit Setting' : 'Add Setting'}
      primaryAction={{
        content: "Confirm",
        onAction: () => this.updateAndClose()
      }}
      secondaryActions={[
        {
          content: "Delete item",
          onAction: this.deleteItem
        }
      ]}
    >
      <Modal.Section>
        {modalType === 'edit' && 
          <EditSettingForm 
            updateSettingItem={this.props.updateSettingItem}
            settingItemTriggered={this.props.settingItemTriggered}
            updateAndClose={this.updateAndClose}
            handleSettingChange={this.props.handleSettingChange}
            idError={this.props.idError}
          />
        }
        {modalType === 'add' && 
          <AddSettingForm
            updateSettingItem={this.props.updateSettingItem}
            settingItemTriggered={this.props.settingItemTriggered}
            updateAndClose={this.updateAndClose}
            handleSettingChange={this.props.handleSettingChange}
            idError={this.props.idError}    
            settings={this.props.settings}      
          />     
        }
      </Modal.Section>
    </Modal>
    );
  }
}

export default SettingsModal;