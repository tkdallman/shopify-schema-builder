import React, { Component } from 'react';
import { TextStyle } from '@shopify/polaris';
import OptionSetList from './OptionSetList.js';

class SettingItem extends Component {
  render() {
    const { item } = this.props;
    return (
      <div>
        {Object.keys(item).map((keyName, keyIndex) => {
          if (keyName === 'options') { return (
            <h4 key={keyName}>
              <OptionSetList options={item.options} />
            </h4>
          )};

          return (
            <h4 key={keyName}>
             <TextStyle variation="strong">{keyName + ':     '}</TextStyle>{item[keyName]}
            </h4>
          )
        }) }
    </div>
    );
  }
}

export default SettingItem;