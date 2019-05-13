import React, { Component } from 'react';
import { TextStyle } from '@shopify/polaris';

class OptionSetList extends Component {

  render() {
    const { options } = this.props;
    
    return (
      <div>
        <TextStyle variation="strong">{'Options:     '}</TextStyle>
        {options.map((optionSet, index) => {
          const hasGroupProperty = optionSet.hasOwnProperty('group');
          return (
            <div key={'option' + index}>
              <TextStyle variation="subdued">
                { hasGroupProperty ? <><TextStyle variation="strong">Group:</TextStyle>{ optionSet.group + '     '}</> : '' }
                <TextStyle variation="strong">Value:</TextStyle>{optionSet.value + '     '}
                <TextStyle variation="strong">Label:</TextStyle>{optionSet.label}
              </TextStyle> 
            </div>
          )
        })}
      </div>
    );
  }
}

export default OptionSetList;