import React, { Component } from "react";
import {
  Layout,
  Page,
  ResourceList,
  Card,
  Button,
  TextField,
  FormLayout,
  Form,
  Stack,
  TextContainer,
} from "@shopify/polaris";
import PropTypes from "prop-types";
import SettingItem from "./SettingItem";
import SettingsModal from './SettingsModal'
import RenderSchemaModal from "./RenderSchemaModal";
import FakeItems from "../FakeItems";
import { uppercaseFirst } from './helpers';

const types = require("../types.json");

class PageLayout extends Component {
  state = {
    modalActive: false,
    modalType: '',
    settingItemTriggered: {},
    settingItemTriggeredIndex: undefined,
    settings: { type: 'Pick an Option' },
    blockTriggeredIndex: undefined,
    idError: false,
  };

  static propTypes = {
    blocks: PropTypes.array,
    settingItems: PropTypes.array,
    addSettingItem: PropTypes.func,
    updateSettingItem: PropTypes.func,
    deleteSettingItem: PropTypes.func,
    moveSettingItem: PropTypes.func,
    addBlock: PropTypes.func,
  };

  handleSettingChange = (change, value) => {
    const { modalType } = this.state;
    const settings = modalType === 'edit' ? { ...this.state.settingItemTriggered } : { ...this.state.settings }
    
    const changeType = change.changeType;
    switch(changeType) {
      case 'editOption':
        settings.options[change.index][change.attribute] = value;
        break;

      case 'removeOption':
        settings.options.splice(change.index, 1);
        break;

      case 'addOption':
        settings.options.push({});
        break;

      case 'editInput':
        if (change.input === 'id') {
          const allSettingIds = this.props.settingItems.map(item => item.id );
          if (allSettingIds && allSettingIds.includes(value)) {
            this.setState(({ idError }) => ({ idError: true })); 
          } else {
            this.setState(({ idError }) => ({ idError: false }));        
          }   
        }     
        const itemsWithOptions = ['radio', 'select'];
        if (itemsWithOptions.includes(value)) {
          settings.options = [{}];
        }   
        settings[change.input] = value;
        break;
      }

    if (modalType === 'edit') {
      this.setState({ settingItemTriggered: settings });
    } else {
      this.setState({ settings });
    }
  };

  handleModalChange = (modalChangeType, index, blockIndex) => {

    if (!this.state.modalActive && modalChangeType !== 'add') {
      let selectedItem;
  
      if (index >= 0) {
        selectedItem = blockIndex >= 0 ? this.props.blocks[blockIndex].settings[index]
          : selectedItem = this.props.settingItems[index];
        
        const itemDetails = JSON.parse(JSON.stringify(selectedItem));
  
        this.setState(({ settingItemTriggered }) => ({
          settingItemTriggered: itemDetails
        }));
        this.setState(({ settingItemTriggeredIndex }) => ({
          settingItemTriggeredIndex: index
        }));      
        this.setState(({ blockTriggeredIndex }) => ({
          blockTriggeredIndex: blockIndex
        }));     
        this.setState(({ idError }) => ({
          idError: false
        }));   
      }
    }
    this.setState(({ modalType }) => ({ modalType: modalChangeType }));
    this.setState(({ modalActive }) => ({ modalActive: !modalActive }));
  };

  handleAddChange = (input, value) => {
    const hasOptions = ['radio', 'select'];
    const settings = {  ...this.state.settings };
    settings[input] = value;

    if (input === 'id') {
      if (this.props.allSettingIds && this.props.allSettingIds.includes(value)) {
        this.setState(({ idError }) => ({ idError: true })); 
      } else {
        this.setState(({ idError }) => ({ idError: false }));        
      }   
    }

    if (input === 'type' && hasOptions.includes(value) && !settings.options) {
      settings.options = [{}];
    };    
    this.setState({ settings });
  }

  addNewOptionSet = () => {
    const settings = this.state.settings;
    settings.options.push({});
    this.setState({ settings });
  };

  removeOptionSet = (index) => {
    const settings = this.state.settings;
    settings.options.splice(index, 1);
    this.setState({ settings });
  }

  handleClose = () => {
    this.setState(({ settings }) => ({ settings: { type: 'Pick an Option' } }));
    this.handleModalChange();
  };  

  moveItem = (index, destination, blockIndex) => {
    this.props.moveSettingItem(index, destination, blockIndex);
  }

  addFakeItems = (blockIndex = undefined) => {
    FakeItems.forEach(item => {
      setTimeout(() => {
        if (item.id) { item.id = item.id + Date.now().toString() };
        this.props.addSettingItem(item, blockIndex);
      }, 200)
    })
  };

  getSettings = (index, numSettings = this.props.settingItems.length) => {
    const settings = [];

    if (index > 0) { 
      settings.push({
        content: '↑', 
        onClick: () => this.moveItem(index, index-1),
      })
    }
    if (index !== numSettings - 1) { 
      settings.push({
        content: '↓', 
        onClick: () => this.moveItem(index, index+1),
      })
    }    
    settings.push({
      content: '*2', 
      onClick: () => {
        this.duplicateSettingsItem(index);
        this.handleModalChange(index+1);
      },
    });

    return settings;
  }

  duplicateSettingsItem = (index, blockIndex) => {
    let selectedItem;
    if (index >= 0) {
      selectedItem = blockIndex >= 0 ? this.props.blocks[blockIndex].settings[index]
        : selectedItem = this.props.settingItems[index];
      
      const itemDetails = JSON.parse(JSON.stringify(selectedItem));

      this.setState(({ settings }) => ({
        settings: itemDetails
      }));
      this.setState(({ idError }) => ({ idError: true }));  
    }
  }

  render() {
    const activeFields = Object.keys(types[this.props.type]);
    const textFields = ["name", "class", "tag"];
    const { handleChange, settingItems } = this.props;

    const allSettingIds = settingItems.map(item => item.id );

    return (
      <Page
        title="Shopify Section Schema Generator"
      >
        <Layout>
          <Layout.AnnotatedSection
            title="Section details"
            description="A number of the common section details here"
          >          
          
            <Card sectioned>
              <TextContainer>
              <Form>
                <FormLayout>
                  {activeFields.map(field => {
                    if (textFields.includes(field)) return (
                      <TextField 
                      key={field}
                      label={uppercaseFirst(field)} 
                      value={this.props.fields[field]}
                      onChange={value => handleChange(field, value)}
                      />
                    )
                  })}        
                </FormLayout>
              </Form>
              </TextContainer>
            </Card>
          </Layout.AnnotatedSection>

         <Layout.AnnotatedSection
            title="Settings"
            description="Fill out your section settings here"
          >         
          <Card sectioned>

            <ResourceList
              resourceName={{ singular: "Setting", plural: "Settings" }}
              items={settingItems}
              renderItem={(item) => {
                const index = settingItems.indexOf(item);
                if (item)
                  return (
                    <ResourceList.Item
                      id={item.id}
                      accessibilityLabel={`View details for ${item.id}`}
                      onClick={() => this.handleModalChange('edit', index)}
                      shortcutActions={this.getSettings(index)}
                    >
                      <SettingItem id={index} item={item} />
                    </ResourceList.Item>
                  );
              }}
            />
            
            <Button onClick={this.addFakeItems}>Add fake setting items</Button>
            <Button onClick={() => this.handleModalChange('add')}>New Setting Item</Button>

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
            {/* <AddSettingModal 
              addSettingItem={this.props.addSettingItem} 
              allSettingIds={allSettingIds}
              handleModalChange={this.handleModalChange}
              modalActive={this.state.modalActive}
              settingItemTriggered={this.state.settingItemTriggered}
              settings={this.state.settings}
              handleClose={this.handleClose}
              idError={this.state.idError}
              handleAddChange={this.handleAddChange}
              addNewOptionSet={this.addNewOptionSet}
              removeOptionSet={this.removeOptionSet}              
            /> */}

          </Card>
          </Layout.AnnotatedSection>          
          {/* <Layout.AnnotatedSection
            title="Blocks"
            description="optional setting"
          >
          { activeFields.includes('blocks') && (
            <Blocks 
              fields={this.props.fields}
              blocks={this.props.blocks}
              addSettingItem={this.props.addSettingItem}
              modalActive={this.state.modalActive}
              handleModalChange={this.handleModalChange}
              settingItemTriggered={this.state.settingItemTriggered}
              settingItemTriggeredIndex={this.state.settingItemTriggeredIndex}
              handleSettingChange={this.handleSettingChange}              
              handleChange={this.props.handleChange}
              duplicateSettingsItem={this.props.duplicateSettingsItem}
              addFakeItems={this.addFakeItems}
              moveItem={this.moveItem}
              addBlock={this.props.addBlock}
              deleteBlock={this.props.deleteBlock}
              handleAddChange={this.handleAddChange}
              addNewOptionSet={this.addNewOptionSet}
              removeOptionSet={this.removeOptionSet}   
            /> 
            )}
          </Layout.AnnotatedSection> */}
          <Layout.AnnotatedSection>  
          <Card sectioned>
              {/* <EditSettingModal
                updateSettingItem={this.props.updateSettingItem}
                deleteSettingItem={this.props.deleteSettingItem}
                modalActive={this.state.modalActive}
                handleModalChange={this.handleModalChange}
                settingItemTriggered={this.state.settingItemTriggered}
                settingItemTriggeredIndex={this.state.settingItemTriggeredIndex}
                blockTriggeredIndex={this.state.blockTriggeredIndex}
                handleSettingChange={this.handleSettingChange}
                idError={this.state.idError}
                
              /> */}
              <Stack>
                <RenderSchemaModal 
                  fields={this.props.fields} 
                  activeFields={Object.keys(types[this.props.type])}
                />              
              </Stack>
          </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    );
  }
}

export default PageLayout;
