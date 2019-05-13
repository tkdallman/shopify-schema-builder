import React, { Component } from 'react';
import { TextField, Stack, Button } from "@shopify/polaris";


class Options extends Component {

  changeOption = (input, index, value, options) => {
    options[index][input] = value;
    this.props.handleChange('options', options);
  }
  
  render() {
    const { index, settings } = this.props;
    const options = settings.options;
    const currentOptionSet = options[index];
    const isLastItem = (options.length - 1) === index;
    const sharedInputs = ['value', 'label'];
    let group;
    
    if (this.props.type === 'select') {
      group = <TextField 
                key={'group'}
                placeholder="group"
                value={currentOptionSet['group']}
                onChange={(value) => this.changeOption('group', index, value, options )}
              />
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
              onChange={(value) => this.changeOption(input, index, value, options )}
            />
          )
        })}
        { isLastItem ? <Button onClick={this.props.addNewOptionSet} label="Add item">+</Button> : '' }
      </Stack>
    );
  }
}

export default Options;