import React, { Component } from "react";
import { TextField, Stack, Button } from "@shopify/polaris";

class EditOptions extends Component {
  render() {
    const { changedSettings, inputType, options, index, handleChange } = this.props;
    const sharedInputs = ["value", "label"];
    let group;

    if (inputType === "select") {
      group = (
        <TextField
          key={"group" + index}
          placeholder="group"
          value={options["group"]}
          onChange={(value) => handleChange({index, attribute: "group" }, value)}

        />
      );
    }

    return (
      <Stack>
        {group}

        {sharedInputs.map(input => {
          return (
            <TextField
              key={input + index}
              placeholder={input}
              value={options[input]}
              onChange={(value) => handleChange({index, attribute: input }, value)}
            />
          );
        })}
      </Stack>
    );
  }
}

export default EditOptions;
