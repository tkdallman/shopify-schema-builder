import React, { Component } from "react";
import { TextField, Stack, Button } from "@shopify/polaris";
import PropTypes from "prop-types";

class EditOptions extends Component {
  static propTypes = {
    index: PropTypes.number,
    inputType: PropTypes.string,
    options: PropTypes.object,
    handleChange: PropTypes.func,
    isLastItem: PropTypes.bool,
  }

  render() {
    const { inputType, options, index, handleChange, isLastItem } = this.props;
    const sharedInputs = ["value", "label"];
    let group;

    if (inputType === "select") {
      group = (
        <TextField
          key={"group" + index}
          placeholder="group"
          value={options["group"]}
          onChange={(value) => handleChange({
            changeType: 'editOption',
            index, 
            attribute: "group" 
          }, value)}
        />
      );
    }

    return (
        <div>
      <Stack>
        {group}

        {sharedInputs.map(input => {
          return (
            <TextField
              key={input + index}
              placeholder={input}
              value={options[input]}
              onChange={(value) => handleChange({
                  changeType: 'editOption',
                  index, 
                  attribute: input 
                }, 
              value)}
            />
          );
        })}
        {isLastItem ? (
          <Button onClick={() => handleChange({ changeType: 'addOption' })} label="Add item">
            +
          </Button>
        ) : (
          <Button onClick={() => handleChange({ changeType: 'removeOption', index })} label="Remove item">
            -
          </Button>
        )}      
      </Stack>
      </div>
    );
  }
}

export default EditOptions;
