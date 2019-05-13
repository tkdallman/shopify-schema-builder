import React, { Component } from "react";
import { Stack, Form, Select, FormLayout, TextField } from "@shopify/polaris";
import EditOptions from "./EditOptions";

const sections = require("../sections.json");

class EditSchemaForm extends Component {
  render() {
    const {
      schemaItems,
      schemaItemTriggeredId,
      changedSettings,
      handleChange,
      updateAndClose,
      schemaItemTriggered
    } = this.props;

    const selectedItem = schemaItems[schemaItemTriggeredId];
    const allOptions = Object.keys(sections);
    const options = allOptions.map(option => {
      return { value: option, label: option };
    });

    const activeType = changedSettings.type || selectedItem.type;
    if (!activeType) return;

    const inputs = Object.keys(sections[activeType]);

    const numberInputs = ["min", "max", "step"];

    return (
      <Form onSubmit={updateAndClose}>
        <FormLayout>
          <Stack vertical>
            <Select
              label="Input type"
              options={options}
              onChange={value => handleChange("type", value)}
              value={changedSettings.type || selectedItem.type}
            />

            {inputs.map(input => {
              if (input === "options") {
                return schemaItemTriggered.options.map((item, index) => {
                  return (
                    <EditOptions
                      key={item}
                      index={index}
                      inputType={changedSettings.type || selectedItem.type}
                      changedSettings={changedSettings}
                      options={schemaItemTriggered.options[index]}
                      handleChange={handleChange}
                    />
                  );
                });
              }

              return (
                <TextField
                  label={input}
                  key={input}
                  type={numberInputs.includes(input) ? "number" : ""}
                  value={
                    changedSettings[input] || changedSettings[input] === ""
                      ? changedSettings[input]
                      : selectedItem[input]
                  }
                  onChange={value => handleChange(input, value)}
                />
              );
            })}
          </Stack>
        </FormLayout>
      </Form>
    );
  }
}

export default EditSchemaForm;
