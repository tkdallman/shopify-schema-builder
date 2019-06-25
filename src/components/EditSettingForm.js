import React, { Component } from "react";
import { Stack, Form, Select, FormLayout, TextField, InlineError } from "@shopify/polaris";
import PropTypes from "prop-types";
import EditOptions from "./EditOptions";

const sections = require("../sections.json");

class EditSettingForm extends Component {
  static propTypes = {
    updateSettingItem: PropTypes.func,
    updateAndClose: PropTypes.func,
    handleChange: PropTypes.func,
    settingItemTriggered: PropTypes.object,
    settingItemTriggeredId: PropTypes.number,
  }

  render() {

    const {
      settingItemTriggered,
      handleChange,
      updateAndClose,
    } = this.props;

    const allOptions = Object.keys(sections);
    if (!allOptions) return false;
    const options = allOptions.map(option => {
      return { value: option, label: option };
    });

    if (!settingItemTriggered) return;

    const inputs = Object.keys(sections[settingItemTriggered.type]);
    const numberInputs = ["min", "max", "step"];

    return (
      <Form onSubmit={updateAndClose}>
        <FormLayout>
          <Stack vertical>
            <Select
              label="Input type"
              options={options}
              onChange={value => handleChange(
                {
                  changeType: "editInput",
                  input: "type"
                }
              , value)}
              value={settingItemTriggered.type}
            />

            {inputs.map(input => {
              if (input === "options") {
                if (!settingItemTriggered.options) return false;
                return (
                  <div key={input}>
                    <p>Options</p>
                      {settingItemTriggered.options.map((item, index) => {
                        const isLastItem = settingItemTriggered.options.length - 1 === index;

                      return (
                        <EditOptions
                          key={'option' + index}
                          index={index}
                          inputType={settingItemTriggered.type}
                          options={settingItemTriggered.options[index]}
                          handleChange={handleChange}
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
                    value={settingItemTriggered[input]}
                    onChange={value => handleChange({
                      changeType: 'editInput',
                      input
                    }, value)}
                  />
                  {input === 'id' && this.props.idError && (
                    <InlineError message="Setting IDs must be unique" fieldID="settingID" />
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

export default EditSettingForm;
