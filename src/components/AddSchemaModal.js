import React, { Component } from "react";
import { Modal,  Button } from "@shopify/polaris";
import AddSchemaForm from './AddSchemaForm';
import PropTypes from "prop-types";
const sections = require("../sections.json");

class AddSchemaModal extends Component {
  static propTypes = {
    addSchemaItem: PropTypes.func,
  }

  state = {
    active: false,
    settings: { type: 'image_picker' },
  };

  handleModalChange = () => {
    this.setState(({ active }) => ({ active: !active }));
  };
  
  handleClose = () => {
    this.setState(({ settings }) => ({ settings: { type: 'text' } }));
    this.setState(({ active }) => ({
      active: !active
    }));
  };

  handleChange = (input, value) => {
    const hasOptions = ['radio', 'select'];
    const settings = {  ...this.state.settings };
    settings[input] = value;
    if (input === 'type' && hasOptions.includes(value) && !settings.options) {
      settings.options = [{}];
    };    
    this.setState({ settings });
  }

  addItem = () => {
    const schemaItem = {};
    const schemaItemProperties = Object.keys(sections[this.state.settings.type]);

    Object.keys(this.state.settings)
      .filter(item => schemaItemProperties.includes(item) || item === 'type')
      .forEach(item => { schemaItem[item] = this.state.settings[item];
    });  

    this.props.addSchemaItem(schemaItem);
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
        <Button onClick={this.handleModalChange}>New Schema Item</Button>
        <Modal
          open={active}
          onClose={this.handleClose}
          title="Add schema section"
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
            <AddSchemaForm 
              addSchemaItem={this.props.addSchemaItem} 
              addNewOptionSet={this.addNewOptionSet}
              removeOptionSet={this.removeOptionSet}
              handleChange={this.handleChange}
              settings={this.state.settings}
            />
          </Modal.Section>
        </Modal>
      </div>
    );
  }
}

export default AddSchemaModal;
