import React, { Component } from 'react';
import { TextField } from "@shopify/polaris";

class SettingTextField extends Component {
  state = {
    input: '',
  };

  render() {
    return (
      <TextField
      label={this.props.type}
      value={this.state.input}
      onChange={(v) =>  this.setState({ 'input': v })}
      />      
    );
  }
}

export default SettingTextField;