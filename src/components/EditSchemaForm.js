import React, { Component } from "react";
import { Stack, Form, Select, FormLayout, TextField } from "@shopify/polaris";
import EditOptions from "./EditOptions";

const sections = require("../sections.json");

class EditSchemaForm extends Component {

  render() {
    const {
      schemaItemTriggeredId,
      schemaItemTriggered,
      handleChange,
      updateAndClose,
    } = this.props;

    const allOptions = Object.keys(sections);
    const options = allOptions.map(option => {
      return { value: option, label: option };
    });

    if (!schemaItemTriggered) return;

    const inputs = Object.keys(sections[schemaItemTriggered.type]);

    const numberInputs = ["min", "max", "step"];

    return (
      <Form onSubmit={updateAndClose}>
        <FormLayout>
          <Stack vertical>
            <Select
              label="Input type"
              options={options}
              onChange={value => handleChange("type", value)}
              value={schemaItemTriggered.type}
            />

            {inputs.map(input => {
              if (input === "options") {
                return (
                    <div key={input}>
                      <p>Options</p>
                        {schemaItemTriggered.options.map((item, index) => {
                        return (
                          <EditOptions
                            key={'option' + index}
                            index={index}
                            inputType={schemaItemTriggered.type}
                            options={schemaItemTriggered.options[index]}
                            handleChange={handleChange}
                          />
                        );
                      })}
                    </div>
                )
              }

              return (
                <TextField
                  label={input}
                  key={input}
                  type={numberInputs.includes(input) ? "number" : ""}
                  value={schemaItemTriggered[input]}
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
