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
import AddSettingModal from "./AddSettingModal";
import EditSettingModal from "./EditSettingModal";
import RenderSchemaModal from "./RenderSchemaModal";
import Blocks from "./Blocks";
import FakeItems from "../FakeItems";
import { uppercaseFirst } from './helpers';


import '../css/IndexStyles.css'

const types = require("../types.json");

class PageLayout extends Component {
  state = {
    modalActive: false,
    settingItemTriggered: {},
    settingItemTriggeredIndex: undefined,
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
    duplicateSettingsItem: PropTypes.func,
  };

  handleSettingChange = (change, value) => {
    const settings = { ...this.state.settingItemTriggered };
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
        const allSettingIds = this.props.settingItems.map(item => item.id );
        if (change.input === 'id') {
          if (allSettingIds && allSettingIds.includes(value)) {
            this.setState(({ idError }) => ({ idError: true })); 
          } else {
            this.setState(({ idError }) => ({ idError: false }));        
          }   
        }        
        settings[change.input] = value;
        break;
      }

    this.setState({ settingItemTriggered: settings });
  };

  handleModalChange = (index, blockIndex) => {

    if (!this.state.modalActive) {
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
    this.setState(({ modalActive }) => ({ modalActive: !modalActive }));
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
        this.props.duplicateSettingsItem(index);
        this.handleModalChange(index+1);
      },
    });

    return settings;
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
                      onClick={() => this.handleModalChange(index)}
                      shortcutActions={this.getSettings(index)}
                    >
                      <SettingItem id={index} item={item} />
                    </ResourceList.Item>
                  );
              }}
            />
            
            <Button onClick={this.addFakeItems}>Add fake setting items</Button>
            <AddSettingModal 
              addSettingItem={this.props.addSettingItem} 
              allSettingIds={allSettingIds}
            />

          </Card>
          </Layout.AnnotatedSection>          
          <Layout.AnnotatedSection
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
            /> 
            )}
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection>  
          <Card sectioned>
              <EditSettingModal
                updateSettingItem={this.props.updateSettingItem}
                deleteSettingItem={this.props.deleteSettingItem}
                modalActive={this.state.modalActive}
                handleModalChange={this.handleModalChange}
                settingItemTriggered={this.state.settingItemTriggered}
                settingItemTriggeredIndex={this.state.settingItemTriggeredIndex}
                blockTriggeredIndex={this.state.blockTriggeredIndex}
                handleChange={this.handleSettingChange}
                idError={this.state.idError}
                
              />
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
