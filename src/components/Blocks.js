import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Card, Collapsible, Stack, TextField } from "@shopify/polaris";
import Block from "./Block";
import SettingsModal from "./SettingsModal";

class Blocks extends Component {
  state = {
    blockState: {
      block0: true,
    },
  };

  static propTypes = {
    blocks: PropTypes.array,
    updateSettingItem: PropTypes.func,
    deleteSettingItem: PropTypes.func,
    modalActive: PropTypes.bool,
    handleModalChange: PropTypes.func,
    settingItemTriggered: PropTypes.object,
    settingItemTriggeredIndex: PropTypes.number,
    handleFieldChange: PropTypes.func,
    moveSettingItem: PropTypes.func,
    addBlock: PropTypes.func,
  };    
  
  addBlock = () => {
    const blockState =  { ...this.state.blockState };
    this.props.addBlock();
    blockState[`block${this.props.blocks.length - 1}`] = true
    this.setState({ blockState });
  }

  handleToggleClick = (index) => {
    const blockState =  { ...this.state.blockState };
    blockState[`block${index}`] = !blockState[`block${index}`];
    this.setState({ blockState });
  };

  render() {
    const { blocks, handleFieldChange, handleModalChange } = this.props;
    const { blockState } = this.state;

    return (
      <>
        {blocks.map((block, index) => {
          return (
            <Card sectioned key={'block' + index} >            
              <Collapsible open={blockState[`block${index}`]} id="basic-collapsible">
                <Block
                  key={'item' + index}
                  blockValues={block}
                  blockIndex={index}
                  updateSettingItem={this.props.updateSettingItem}
                  deleteSettingItem={this.props.deleteSettingItem}
                  modalActive={this.props.modalActive}
                  handleModalChange={this.props.handleModalChange}
                  settingItemTriggered={this.props.settingItemTriggered}
                  settingItemTriggeredIndex={this.props.settingItemTriggeredIndex}
                  handleSettingChange={this.handleSettingChange}              
                  handleFieldChange={this.props.handleFieldChange}
                  moveSettingItem={this.props.moveSettingItem}
                  duplicateSettingsItem={this.props.duplicateSettingsItem}                  
                  handleClose={this.handleClose}
                  modalType={this.state.modalType}
                  blockTriggeredIndex={this.state.blockTriggeredIndex}   
                  idError={this.state.idError}    
                  settings={this.state.settings}
                  addSettingItem={this.props.addSettingItem}  
                  fields={this.props.fields}
                  />
              </Collapsible>
              <Stack distribution="center">
                {blockState[`block${index}`] && (                
                  <>
                    <Button onClick={() => this.props.addFakeItems(index)}>Add fake setting items</Button>

                    <SettingsModal 
                      modalActive={this.state.modalActive}
                      handleClose={this.handleClose}
                      modalType={this.state.modalType}
                      handleSettingChange={this.handleSettingChange}
                      updateSettingItem={this.props.updateSettingItem}
                      deleteSettingItem={this.props.deleteSettingItem}
                      settingItemTriggered={this.state.settingItemTriggered}
                      settingItemTriggeredIndex={this.state.settingItemTriggeredIndex}
                      blockTriggeredIndex={this.state.blockTriggeredIndex}   
                      idError={this.state.idError}    
                      settings={this.state.settings}
                      addSettingItem={this.props.addSettingItem}       
                    />
                  </>
                )}
                <Button onClick={() => this.props.deleteBlock(index)}>Delete Block</Button>
                <Button onClick={() => handleModalChange('add', undefined, index)}>New Setting Item</Button>               
                <Button
                  onClick={() => this.handleToggleClick(index)}
                  ariaExpanded={'open0'}
                  ariaControls="basic-collapsible"
                  >
                  { blockState[`block${index}`] ? '⇧' : '⇩'}
                </Button>   
              </Stack>           
            </Card>
            
          )
        })}

        <Card sectioned>
          <Stack distribution="center"  alignment="trailing">
            <Button onClick={() => this.addBlock()}>Add New Block</Button>
            { blocks.length > 0  && (
              <TextField 
                key={'max_blocks'}
                label={'Max Blocks'}
                type="number" 
                min="1"
                value={this.props.fields.max_blocks}
                onChange={value => handleFieldChange('max_blocks', value)}
                />
              )}            
            </Stack>
        </Card>
      </>
    );
  }
}

export default Blocks;
