import React, { Component } from "react";
import { connect } from 'react-redux';
import { Stack, Form, Select, FormLayout, TextField, InlineError } from "@shopify/polaris";
import PropTypes from "prop-types";
import EditOptions from "./EditOptions";

const sections = require("../data/sections.json");

class EditSettingForm extends Component {

  static propTypes = {
    updateSettingItem: PropTypes.func,
    handleSettingChange: PropTypes.func,
    updateAndClose: PropTypes.func,
    idError: PropTypes.bool,
  }

  componentDidMount() {
    this.props.preloadData(this.props.modal.item)
  }

  render() {
    const { handleSettingChange, settings } = this.props;

    const allOptions = Object.keys(sections);
    if (!allOptions) return false;
    if (!this.props.modal.modalActive || !settings || settings.type === "Pick an Option") return false;
    
    const options = allOptions.map(option => {
      return { value: option, label: option };
    });

    const inputs = Object.keys(sections[settings.type]);
  
    const numberInputs = ["min", "max", "step"];

    return (
      <Form>
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
              value={settings.type}
            />

            {inputs.map(input => {
              if (input === "options") {
                if (!settings.options) return false;
                return (
                  <div key={input}>
                    <p>Options</p>
                      {settings.options.map((item, index) => {
                        const isLastItem = settings.options.length - 1 === index;

                      return (
                        <EditOptions
                          key={'option' + index}
                          index={index}
                          inputType={settings.type}
                          options={settings.options[index]}
                          handleSettingChange={handleSettingChange}
                          isLastItem={isLastItem}
                        />
                      );
                    })}
                  </div>
                )
              }

              return (
                <div key={input}>
                  <TextField
                    label={input}
                    key={input}
                    type={numberInputs.includes(input) ? "number" : ""}
                    value={settings[input]}
                    onChange={value => handleSettingChange({
                      changeType: 'editInput',
                      input
                    }, value)}
                  />
                  {input === 'id' && this.props.errorState && (
                    <InlineError message="Setting ID must be unique and cannot be blank" fieldID="settingID" />
                  )}
                </div>
              );
            })}
          </Stack>
        </FormLayout>
      </Form>
    );
  }
}

const mapStateToProps = state => ({ 
  settingItems: state.settings,
  modalType: state.modal.modalType,
  modal: state.modal,
  error: state.error
})

export default connect(mapStateToProps)(EditSettingForm);
