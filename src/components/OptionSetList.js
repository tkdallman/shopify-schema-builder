import React, { Component } from 'react';
import { TextStyle, Badge, Stack } from '@shopify/polaris';

class OptionSetList extends Component {

  render() {
    const { options } = this.props;
    
    if (!options) return false;
      
    return (
      <div>
        <TextStyle variation="strong">{'Options:     '}</TextStyle>
        {options.map((optionSet, index) => {
          const hasGroupProperty = optionSet.hasOwnProperty('group');
          if (optionSet.value === undefined) return false;
          return (
            <Badge key={'option' + index}>
              <Stack vertical="true">
              <TextStyle variation="subdued">
                { hasGroupProperty ? <><TextStyle variation="strong">Group: </TextStyle>{ optionSet.group + '      '}</> : '' }
                <TextStyle variation="strong">Value: </TextStyle>{optionSet.value + '     '}
                <TextStyle variation="strong">Label: </TextStyle>{optionSet.label}
              </TextStyle> 
              </Stack>
            </Badge>
          )
        })}
      </div>
    );
  }
}

export default OptionSetList;