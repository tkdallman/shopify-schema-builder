import React, { Component } from "react";
import { Modal,  Button } from "@shopify/polaris";
import AddSettingForm from './AddSettingForm';
import PropTypes from "prop-types";
const sections = require("../sections.json");

class AddSettingModal extends Component {
  static propTypes = {
    addSettingItem: PropTypes.func,
    blockIndex: PropTypes.number,
    settingIds: PropTypes.array,
  }

  state = {
    active: false,
    settings: { type: 'image_picker' },
    idError: false,
  };

  handleModalChange = () => {
    this.setState(({ active }) => ({ active: !active }));
  };
  
  handleClose = () => {
    this.setState(({ settings }) => ({ settings: { type: 'text' } }));
    this.handleModalChange();
  };

  handleChange = (input, value) => {
    const hasOptions = ['radio', 'select'];
    const settings = {  ...this.state.settings };
    settings[input] = value;

    if (input === 'id') {
      if (this.props.allSettingIds && this.props.allSettingIds.includes(value)) {
        this.setState(({ idError }) => ({ idError: true })); 
      } else {
        this.setState(({ idError }) => ({ idError: false }));        
      }   
    }

    if (input === 'type' && hasOptions.includes(value) && !settings.options) {
      settings.options = [{}];
    };    
    this.setState({ settings });
  }

  addItem = () => {
    if (this.state.idError) return;
    const settingItem = {};
    const settingItemProperties = Object.keys(sections[this.state.settings.type]);
    const blockIndex = this.props.blockIndex >= 0 ? this.props.blockIndex : undefined;

    Object.keys(this.state.settings)
      .filter(item => settingItemProperties.includes(item) || item === 'type')
      .forEach(item => { settingItem[item] = this.state.settings[item];
    });  

    this.props.addSettingItem(settingItem, blockIndex);
    this.handleClose();
  }

  addNewOptionSet = () => {
    const settings = this.state.settings;
    settings.options.push({});
    this.setState({ settings });
  };

  removeOptionSet = (index) => {
    const settings = this.state.settings;
    settings.options.splice(index, 1);
    this.setState({ settings });
  }

  render() {
    const { active } = this.state;

    return (
      <div>
        <Button onClick={this.handleModalChange}>New Setting Item</Button>
        <Modal
          open={active}
          onClose={this.handleClose}
          title="Add setting section"
          primaryAction={{
            content: "Add section",
            onAction: this.addItem
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: this.handleClose
            }
          ]}
        >
          <Modal.Section>
            <AddSettingForm 
              addSettingItem={this.props.addSettingItem} 
              addNewOptionSet={this.addNewOptionSet}
              removeOptionSet={this.removeOptionSet}
              handleChange={this.handleChange}
              settings={this.state.settings}
              idError={this.state.idError}
            />
          </Modal.Section>
        </Modal>
      </div>
    );
  }
}

export default AddSettingModal;
