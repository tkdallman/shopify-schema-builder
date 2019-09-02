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
import Blocks from "./Blocks";
import FakeItems from "../FakeItems";
import { uppercaseFirst } from './helpers';

const types = require("../types.json");

class PageLayout extends Component {
  state = {
    modalActive: false,
    modalType: '',
    settingItemTriggered: {},
    settingItemTriggeredIndex: undefined,
    settingItemTriggeredId: '',
    settings: { type: 'Pick an Option' },
    blockTriggeredIndex: undefined,
    idError: false,
  };

  static propTypes = {
    type: PropTypes.string,
    handleFieldChange: PropTypes.func,
    fields: PropTypes.object,
    settingItems: PropTypes.array,
    blocks: PropTypes.array,
    addSettingItem: PropTypes.func,
    updateSettingItem: PropTypes.func,
    deleteSettingItem: PropTypes.func,
    moveSettingItem: PropTypes.func,
    addBlock: PropTypes.func,
    deleteBlock: PropTypes.func,
  };

  handleSettingChange = (change, value) => {
    const { modalType, blockTriggeredIndex, settingItemTriggered } = this.state;
    const { blocks, settingItems } = this.props;
    const settings = modalType === 'edit' ? { ...settingItemTriggered } : { ...this.state.settings }
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
        const itemsWithoutId = ['header', 'paragraph'];
        const itemsWithOptions = ['radio', 'select'];

        if (change.input === 'type' && itemsWithoutId.includes(value)) {
          this.setState(({ idError }) => ({ idError: false }));        
        } 
        if (change.input === 'id') {
          const allSettings = blockTriggeredIndex >= 0 ? blocks[blockTriggeredIndex].settings : settingItems;
          const allSettingIds = allSettings.map(item => item.id).filter(item => item !== undefined);
          let errorState = false;
          if (allSettingIds && allSettingIds.includes(value) && value !== this.state.settingItemTriggeredId) errorState = true;
          if (value === '') errorState = true;
          
          this.setState(({ idError }) => ({ idError: errorState }));        
        }  

        if (itemsWithOptions.includes(value)) {
          settings.options = [{}];
        }   

        settings[change.input] = value;
        break;
      }

    if (modalType === 'edit') {
      this.setState(({ settingItemTriggered }) => ({ settingItemTriggered: settings }));        
    } else {
      this.setState(({ settings }));        
    }
  };

  handleModalChange = (modalChangeType, index, blockIndex) => {
    if (!this.state.modalActive && !['add', 'duplicate'].includes(modalChangeType)) {
      let selectedItem;
  
      if (index >= 0) {
        selectedItem = blockIndex >= 0 ? this.props.blocks[blockIndex].settings[index]
          : selectedItem = this.props.settingItems[index];
        
        const itemDetails = JSON.parse(JSON.stringify(selectedItem));
  
        this.setState(({ settingItemTriggered }) => ({  settingItemTriggered: itemDetails  }));
        this.setState(({ settingItemTriggeredIndex }) => ({  settingItemTriggeredIndex: index  })); 
        this.setState(({ settingItemTriggeredId }) => ({  settingItemTriggeredId: itemDetails.id  }));           
        this.setState(({ idError }) => ({  idError: false  }));   
      }
    } else {
      this.setState(({ idError }) => ({  idError: true  }));   
    }

    this.setState(({ blockTriggeredIndex }) => ({ blockTriggeredIndex: blockIndex }));  
    this.setState(({ modalType }) => ({ modalType: modalChangeType }));
    this.setState(({ modalActive }) => ({ modalActive: !modalActive }));
  };

  handleClose = () => {
    this.setState(({ settings }) => ({ settings: { type: 'Pick an Option' } }));
    this.handleModalChange();
  };  

  addFakeItems = (blockIndex) => {
    FakeItems.forEach(item => {
      setTimeout(() => {
        if (item.id) { item.id = item.id + Date.now().toString() };
        this.props.addSettingItem(item, blockIndex);
      }, 200)
    })
  };

  getSettings = (index, numSettings = this.props.settingItems.length) => {
    const settings = [];
    const { moveSettingItem } = this.props;

    if (index > 0) { 
      settings.push({
        content: '↑', 
        onClick: () => moveSettingItem(index, index-1),
      })
    }
    if (index !== numSettings - 1) { 
      settings.push({
        content: '↓', 
        onClick: () => moveSettingItem(index, index+1),
      })
    }    
    settings.push({
      content: "⇉", 
      onClick: () => {
        this.duplicateSettingsItem(index);
        this.handleModalChange('duplicate', index);
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
    }
  }

  render() {
    const activeFields = Object.keys(types[this.props.type]);
    const { modalActive,
            modalType,
            settingItemTriggered,
            settingItemTriggeredIndex,
            blockTriggeredIndex,
            idError,
            settings,
          } = this.state;

    const textFields = ["name", "class", "tag"];
    const { handleFieldChange, 
            settingItems,
            deleteSettingItem,
            updateSettingItem,
            addSettingItem,
            moveSettingItem,
            fields,
            blocks,
            addBlock,
            deleteBlock,      
          } = this.props;

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
                      onChange={value => handleFieldChange(field, value)}
                      />
                    )
                    return <p key={field}></p>
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
            
            <Stack distribution="center"  alignment="trailing">
              <Button onClick={this.addFakeItems}>Add fake setting items</Button>
              <Button onClick={() => this.handleModalChange('add')}>New Setting Item</Button>
            </Stack>

            <SettingsModal 
              modalActive={modalActive}
              handleClose={this.handleClose}
              modalType={modalType}
              handleSettingChange={this.handleSettingChange}
              updateSettingItem={updateSettingItem}
              deleteSettingItem={deleteSettingItem}
              settingItemTriggered={settingItemTriggered}
              settingItemTriggeredIndex={settingItemTriggeredIndex}
              blockTriggeredIndex={blockTriggeredIndex}   
              idError={idError}    
              settings={settings}
              addSettingItem={addSettingItem}       
            />

          </Card>
          </Layout.AnnotatedSection>          
          <Layout.AnnotatedSection
            title="Blocks"
            description="optional setting"
          >
          { activeFields.includes('blocks') && (
            <Blocks 
              modalActive={modalActive}
              handleClose={this.handleClose}
              modalType={modalType}
              handleModalChange={this.handleModalChange}
              handleSettingChange={this.handleSettingChange}
              updateSettingItem={updateSettingItem}
              deleteSettingItem={deleteSettingItem}
              moveSettingItem={this.props.moveSettingItem}      
              settingItemTriggered={settingItemTriggered}
              settingItemTriggeredIndex={settingItemTriggeredIndex}
              blockTriggeredIndex={blockTriggeredIndex}   
              idError={idError}    
              settings={settings}
              addSettingItem={addSettingItem}  
              handleFieldChange={handleFieldChange}  
              fields={fields}
              blocks={blocks} 
              addBlock={addBlock} 
              deleteBlock={deleteBlock}  
              addFakeItems={this.addFakeItems}   
            /> 
            )}
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection>  
          <Card sectioned>
              <Stack distribution="center"  alignment="trailing">

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
