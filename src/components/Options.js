import React, { Component } from "react";
import { TextField, Stack, Button } from "@shopify/polaris";
import PropTypes from "prop-types";

class Options extends Component {
  static propTypes = {
    index: PropTypes.number,
    type: PropTypes.string,
    settings: PropTypes.object,
    handleChange: PropTypes.func,
    addNewOptionSet: PropTypes.func,
    removeOptionSet: PropTypes.func,
  };

  changeOption = (input, index, value, options) => {
    options[index][input] = value;
    this.props.handleChange("options", options);
  };

  render() {
    const { index, settings: { options }, type } = this.props;
    const currentOptionSet = options[index];
    const isLastItem = options.length - 1 === index;
    const sharedInputs = ["value", "label"];
    let group;

    if (type === "select") {
      group = (
        <TextField
          key={"group" + index}
          placeholder="group"
          value={currentOptionSet["group"]}
          onChange={value => this.changeOption("group", index, value, options)}
        />
      );
    }

    return (
      <Stack>
        {group}
        {sharedInputs.map(input => {
          return (
            <TextField
              key={input}
              placeholder={input}
              value={currentOptionSet[input]}
              onChange={value =>
                this.changeOption(input, index, value, options)
              }
            />
          );
        })}
        {isLastItem ? (
          <Button onClick={this.props.addNewOptionSet} label="Add item">+</Button>
        ) : (
          <Button onClick={() => {this.props.removeOptionSet(index)}} label="Add item">-</Button>
        )}
      </Stack>
    );
  }
}

export default Options;
