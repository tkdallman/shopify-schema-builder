import React, { Component } from "react";
import { Modal } from "@shopify/polaris";
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
    settings: { type: 'Pick an Option' },
    idError: false,
  };



  addItem = () => {
    if (this.props.idError) return;
    const settingItem = {};
    const settingItemProperties = Object.keys(sections[this.props.settings.type]);
    const blockIndex = this.props.blockIndex >= 0 ? this.props.blockIndex : undefined;

    Object.keys(this.props.settings)
      .filter(item => settingItemProperties.includes(item) || item === 'type')
      .forEach(item => { settingItem[item] = this.props.settings[item];
    });  

    this.props.addSettingItem(settingItem, blockIndex);
    this.props.handleClose();
  }


  render() {
    const { addModalActive } = this.props;
    return (
      <div>
        <Modal
          open={addModalActive}
          onClose={this.props.handleClose}
          title="Add setting section"
          primaryAction={{
            content: "Add section",
            onAction: this.addItem
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: this.props.handleClose
            }
          ]}
        >
          <Modal.Section>
            <AddSettingForm 
              addSettingItem={this.props.addSettingItem} 
              addNewOptionSet={this.props.addNewOptionSet}
              removeOptionSet={this.props.removeOptionSet}
              handleAddChange={this.props.handleAddChange}
              settings={this.props.settings}
              idError={this.props.idError}
              settingItemTriggered={this.props.settingItemTriggered}
            />
          </Modal.Section>
        </Modal>
      </div>
    );
  }
}

export default AddSettingModal;
