import React, { Component } from 'react';
import { Modal } from "@shopify/polaris";
import PropTypes from "prop-types";
import AddSettingForm from "./AddSettingForm";
import EditSettingForm from './EditSettingForm';
import { removeExtraneous } from './helpers';

const sections = require("../sections.json");

class SettingsModal extends Component {
  static propTypes = {
    modalActive: PropTypes.bool,
    handleClose: PropTypes.func,
    modalType: PropTypes.string,
    handleSettingChange: PropTypes.func,
    updateSettingItem: PropTypes.func,
    deleteSettingItem: PropTypes.func,
    settingItemTriggered: PropTypes.object,
    settingItemTriggeredIndex: PropTypes.number,
    blockTriggeredIndex: PropTypes.number,
    idError: PropTypes.bool,
    settings: PropTypes.object,
    addSettingItem: PropTypes.func,
  }

  deleteItem = () => {
    const { deleteSettingItem, settingItemTriggeredIndex, blockTriggeredIndex } = this.props;
    const blockIndex = blockTriggeredIndex >= 0 ? blockTriggeredIndex : undefined;    
    deleteSettingItem(settingItemTriggeredIndex, blockTriggeredIndex);
    this.props.handleClose(settingItemTriggeredIndex, blockIndex);
  }
  
  updateAndClose = () => {
    const { settingItemTriggeredIndex, settingItemTriggered, blockTriggeredIndex, modalType, settings } = this.props;
    if (this.props.idError) return;
    const blockIndex = blockTriggeredIndex >= 0 ? blockTriggeredIndex : undefined;

    if (modalType === 'edit') {
      const updatedSettingItem = {  ...settingItemTriggered };
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
      title={`${modalType ? modalType.charAt(0).toUpperCase() + modalType.slice(1) : ''} Setting`}
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
        {modalType === 'duplicate' && 
          <AddSettingForm 
            updateSettingItem={this.props.updateSettingItem}
            updateAndClose={this.updateAndClose}
            handleSettingChange={this.props.handleSettingChange}
            idError={this.props.idError}
            settings={this.props.settings}      
          />
        }
        {modalType === 'add' && 
          <AddSettingForm
            updateSettingItem={this.props.updateSettingItem}
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