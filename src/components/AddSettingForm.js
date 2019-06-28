import React, { Component } from 'react';
import { Stack, Form, Select, FormLayout, TextField, InlineError } from "@shopify/polaris";
import Options from './Options';
import PropTypes from "prop-types";
const sections = require("../sections.json");

class AddSettingForm extends Component {

  static propTypes = {
    addSettingItem: PropTypes.func,
    addNewOptionSet: PropTypes.func,
    removeOptionSet: PropTypes.func,
    handleSettingChange: PropTypes.func,
    settings: PropTypes.object,
  }
  
  render() {
    const { settings, settingItemTriggered, handleSettingChange } = this.props;
    const allOptions = [ 'Pick an Option', ...Object.keys(sections)];
    const options = allOptions.map(option => {
      return { value: option, label: option };
    });
    let additionalInputs = [];

    if (settings.type !== 'Pick an Option') {
      additionalInputs = (Object.keys(sections[settings.type]) || []);
    }
    const numberInputs = ['min', 'max', 'step'];

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormLayout>
          <Stack vertical>
            <Select
              label="Input type"
              options={options}
              onChange={value => handleSettingChange(
                {
                  changeType: "editInput",
                  input: "type" 
                }
              , value)}
              value={ settings.type || settingItemTriggered.type }
            />

            {additionalInputs.map(input => {
              if (input === 'options') {
                if (settings.options && settings.options.length > 0) {
                  return (
                    <div key={input}>
                      <p>Options</p>
                      {settings.options.map((item, index) => {
                        return <Options 
                          key={index} 
                          index={index}
                          type={settings.type}
                          settings={settings} 
                          handleSettingsChange={this.props.handleSettingChange}
                        />
                      })}
                    </div>
                  )
                }
              }

              return (
                <div key={input}>
                  <TextField
                    label={input}
                    key={input}
                    type={numberInputs.includes(input) ? 'number' : ''}
                    value={settings[input] || this.props.settingItemTriggered[input]}
                    onChange={value => handleSettingChange({
                      changeType: 'editInput',
                      input
                    }, value)}
                  /> 
                  {input === 'id' && this.props.idError && (
                    <InlineError message="Setting IDs must be unique" fieldID="settingID" />
                  )}
                </div>
              )  
              })
            }
          </Stack>
        </FormLayout>
      </Form>
    );
  }
}

export default AddSettingForm;