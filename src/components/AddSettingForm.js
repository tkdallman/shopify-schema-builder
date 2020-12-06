import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Stack, Form, Select, FormLayout, TextField, InlineError } from "@shopify/polaris";
import Options from './Options';
import PropTypes from "prop-types";

const sections = require("../data/sections.json");

class AddSettingForm extends Component {

  static propTypes = {
    preloadData: PropTypes.func,
    settings: PropTypes.object, 
    updateAndClose: PropTypes.func,
    handleSettingChange: PropTypes.func,
    idError: PropTypes.bool,
  }

  componentDidMount() {
    if (this.props.modal.modalType === 'duplicate') {
      this.props.preloadData(this.props.modal.item)
    }
  }

  render() {
    const { settings, handleSettingChange } = this.props;
    const allOptions = [ 'Pick an Option', ...Object.keys(sections)];
    const options = allOptions.map(option => { return { value: option, label: option }});
    let additionalInputs = [];

    if (settings.type !== 'Pick an Option') {
      additionalInputs = (Object.keys(sections[settings.type]) || []);
    }
    const numberInputs = ['min', 'max', 'step'];

    return (
      <Form onSubmit={this.updateAndClose}>
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
              value={ settings.type }
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
                          handleSettingChange={this.props.handleSettingChange}
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
                    value={settings[input]}
                    onChange={value => handleSettingChange({
                      changeType: 'editInput',
                      input
                    }, value)}
                  /> 
                  {input === 'id' && this.props.error && (
                    <InlineError message="Setting ID must be unique and cannot be blank" fieldID="settingID" />
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

const mapStateToProps = state => ({ 
  settingItems: state.settings,
  settingItemTriggered: state.modal.item,
  modal: state.modal,
  modalType: state.modal.modalType,
  error: state.error.errorState
})

export default connect(mapStateToProps)(AddSettingForm);