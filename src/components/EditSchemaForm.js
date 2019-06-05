import React, { Component } from "react";
import { Stack, Form, Select, FormLayout, TextField } from "@shopify/polaris";
import PropTypes from "prop-types";
import EditOptions from "./EditOptions";

const sections = require("../sections.json");

class EditSchemaForm extends Component {
  static propTypes = {
    updateSchemaItem: PropTypes.func,
    updateAndClose: PropTypes.func,
    handleChange: PropTypes.func,
    schemaItemTriggered: PropTypes.object,
    schemaItemTriggeredId: PropTypes.number,
  }

  render() {
    const {
      schemaItemTriggered,
      handleChange,
      updateAndClose,
    } = this.props;

    const allOptions = Object.keys(sections);
    if (!allOptions) return false;
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
              onChange={value => handleChange(
                {
                  changeType: "editInput",
                  input: "type"
                }
              , value)}
              value={schemaItemTriggered.type}
            />

            {inputs.map(input => {
              if (input === "options") {
                if (!schemaItemTriggered.options) return false;
                return (
                  <div key={input}>
                    <p>Options</p>
                      {schemaItemTriggered.options.map((item, index) => {
                        const isLastItem = schemaItemTriggered.options.length - 1 === index;

                      return (
                        <EditOptions
                          key={'option' + index}
                          index={index}
                          inputType={schemaItemTriggered.type}
                          options={schemaItemTriggered.options[index]}
                          handleChange={handleChange}
                          isLastItem={isLastItem}
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
                  onChange={value => handleChange({
                    changeType: 'editInput',
                    input
                  }, value)}
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
