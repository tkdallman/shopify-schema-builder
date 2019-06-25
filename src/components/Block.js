import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField, FormLayout, Form, Button, ResourceList } from "@shopify/polaris";
import SettingItem from "./SettingItem";

class Blocks extends Component {

  static propTypes = {
    blockValues: PropTypes.object,
    blockIndex: PropTypes.number,
    updateSettingItem: PropTypes.func,
    deleteSettingItem: PropTypes.func,
    modalActive: PropTypes.bool,
    handleModalChange: PropTypes.func,
    settingItemTriggered: PropTypes.object,
    settingItemTriggeredIndex: PropTypes.number,
    handleChange: PropTypes.func,
    moveItem: PropTypes.func,
  };    

  getSettings = (index) => {
    const settings = [];
    const { blockValues, blockIndex, moveItem } = this.props;
    const numSettings = blockValues.settings.length;

    if (index > 0) { 
      settings.push({
        content: '↑', 
        onClick: () => moveItem(index, index-1, blockIndex),
      })
    }
    if (index !== numSettings - 1) { 
      settings.push({
        content: '↓', 
        onClick: () => moveItem(index, index+1, blockIndex),
      })
    }  
    settings.push({
      content: '*2', 
      onClick: () => {
        this.props.duplicateSettingsItem(index, blockIndex);
        this.props.handleModalChange(index+1);
      },
    });     
    return settings;
  }

  render() {
    const activeFields = ["type", "name"];
    const { blockValues, blockIndex } = this.props;

    return (
      <div>
        <Form>
          <FormLayout>
            {activeFields.map(field => {
              return (
                <TextField
                  key={field}
                  label={field}
                  value={blockValues[field]}
                  onChange={value => this.props.handleChange(field, value, blockIndex)}
                />
              );
            })}
            Settings
            <ResourceList
              resourceName={{ singular: "Setting", plural: "Settings" }}
              items={blockValues.settings}
              renderItem={item => {
                const index = blockValues.settings.indexOf(item);

                if (item)
                  return (
                    <ResourceList.Item
                      id={index}
                      key={index}
                      accessibilityLabel={`View details for ${item.id}`}
                      onClick={() => this.props.handleModalChange(index, blockIndex)}
                      shortcutActions={this.getSettings(index)}
                    >
                      <SettingItem id={index} item={item} />
                    </ResourceList.Item>
                  );
              }}
            />
          </FormLayout>
        </Form>
      </div>
    );
  }
}

export default Blocks;
