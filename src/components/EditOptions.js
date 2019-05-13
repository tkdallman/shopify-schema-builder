import React, { Component } from 'react';
import { TextField, Stack, Button } from "@shopify/polaris";


class EditOptions extends Component {
  
  render() {
    const { changedSettings, inputType, options } = this.props;
    const sharedInputs = ['value', 'label'];
    console.log(options);

    return (
      <Stack>
        {sharedInputs.map(input => {
          return (
            <TextField 
              key={input}
              placeholder={input}
              value={options[input]}
              // onChange={(value) => this.changeOption(input, index, value, options )}
            />
          )
        })}
      </Stack>
    );
  }
}

export default EditOptions;