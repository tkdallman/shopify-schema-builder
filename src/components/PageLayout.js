import React, { Component } from "react";
import {
  Layout,
  Page,
  ResourceList,
  Card,
  Heading,
  Button
} from "@shopify/polaris";
import PropTypes from "prop-types";
import SchemaItem from "./SchemaItem";
import AddSchemaModal from "./AddSchemaModal";
import EditSchemaModal from "./EditSchemaModal";
import RenderSchemaModal from "./RenderSchemaModal";
import FakeItems from "../FakeItems";

class PageLayout extends Component {
  state = {
    modalActive: false,
    schemaItemTriggered: {},
    schemaItemTriggeredIndex: undefined,
  };

  static propTypes = {
    schemaItems: PropTypes.array,
    addSchemaItem: PropTypes.func,
    updateSchemaItem: PropTypes.func,
    deleteSchemaItem: PropTypes.func,
    moveSchemaItem: PropTypes.func,
  };

  handleSettingChange = (change, value) => {
    const settings = { ...this.state.schemaItemTriggered };
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
        settings[change.input] = value;
        break;
      
      default: 
      }

    this.setState({ schemaItemTriggered: settings });
  };

  handleModalChange = index => {
    if (index >= 0) {
      const itemDetails = JSON.parse(JSON.stringify(this.props.schemaItems[index]));

      this.setState(({ schemaItemTriggered }) => ({
        schemaItemTriggered: itemDetails
      }));
      this.setState(({ schemaItemTriggeredIndex }) => ({
        schemaItemTriggeredIndex: index
      }));      
    }
    this.setState(({ modalActive }) => ({ modalActive: !modalActive }));
  };

  moveItem = (index, destination) => {
    this.props.moveSchemaItem(index, destination);
  }

  addFakeItems = () => {
    FakeItems.forEach(item => {
      setTimeout(() => {
        this.props.addSchemaItem(item);
      }, 200)
    })
  };

  getSettings = index => {
    const settings = [];

    if (index > 0) { 
      settings.push({
        content: '↑', 
        onClick: () => this.moveItem(index, index-1),
      })
    }
    if (index !== this.props.schemaItems.length - 1) { 
      settings.push({
        content: '↓', 
        onClick: () => this.moveItem(index, index+1),
      })
    }    
    return settings;
  }

  render() {
    return (
      <Page>
        <Heading>Schema Generator</Heading>
        <Card>
          <ResourceList
            resourceName={{ singular: "Schema Item", plural: "Schema Items" }}
            items={this.props.schemaItems}
            renderItem={(item) => {
              const index = this.props.schemaItems.indexOf(item);

              if (item)
                return (
                  <ResourceList.Item
                    id={index}
                    key={index}
                    accessibilityLabel={`View details for ${item.id}`}
                    onClick={this.handleModalChange}
                    shortcutActions={this.getSettings(index)}
                  >
                    <SchemaItem id={index} item={item} />
                  </ResourceList.Item>
                );
            }}
          />
        </Card>
        <Card sectioned>
          <Layout.AnnotatedSection>
            <EditSchemaModal
              updateSchemaItem={this.props.updateSchemaItem}
              deleteSchemaItem={this.props.deleteSchemaItem}
              modalActive={this.state.modalActive}
              handleModalChange={this.handleModalChange}
              schemaItemTriggered={this.state.schemaItemTriggered}
              schemaItemTriggeredIndex={this.state.schemaItemTriggeredIndex}
              handleChange={this.handleSettingChange}
            />
            <Button onClick={this.addFakeItems}>Add fake schema items</Button>
            <AddSchemaModal addSchemaItem={this.props.addSchemaItem} />
            <RenderSchemaModal schemaItems={this.props.schemaItems} />            
          </Layout.AnnotatedSection>
        </Card>
      </Page>
    );
  }
}

export default PageLayout;
