import React, { Component } from 'react';
import { Stack, Form, Select, FormLayout, TextField } from "@shopify/polaris";
import Options from './Options';

const sections = require("../sections.json");

class AddSchemaForm extends Component {

  render() {
    const { settings } = this.props;
    const allOptions = Object.keys(sections);
    const options = allOptions.map(option => {
      return { value: option, label: option };
    });

    const additionalInputs = (Object.keys(sections[settings.type]) || []);
    const numberInputs = ['min', 'max', 'step'];

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormLayout>
          <Stack vertical>
            <Select
              label="Input type"
              options={options}
              onChange={(v) =>  this.props.handleChange('type', v)}
              value={settings.type}
            />

            {additionalInputs.map(input => {
              
              if (input === 'options') {
                if (settings.options && settings.options.length > 0) {
                  return (
                    <div key={input}>
                      <p>Options</p>
                      {settings.options.map((item, index) => {
                        return <Options 
                          key={index} 
                          index={index}
                          type={this.props.settings.type}
                          settings={settings} 
                          handleChange={this.props.handleChange}
                          addNewOptionSet={this.props.addNewOptionSet}
                        />
                      })}
                    </div>
                  )
                }
              }

              return <TextField
                label={input}
                key={input}
                type={numberInputs.includes(input) ? 'number' : ''}
                value={this.props.settings[input]}
                onChange={(v) => this.props.handleChange(input,v)}
              />   
              })
            }
          </Stack>
        </FormLayout>
      </Form>
    );
  }
}

export default AddSchemaForm;