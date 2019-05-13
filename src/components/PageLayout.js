import React, { Component } from 'react';
import { Layout, Page, ResourceList, Card, Heading, Button } from "@shopify/polaris";
import SchemaItem from './SchemaItem';
import AddSchemaModal from './AddSchemaModal';
import EditSchemaModal from './EditSchemaModal';
import FakeItems from '../FakeItems';

class PageLayout extends Component {
  state = {
    modalActive: false,
    schemaItemTriggered: {},
    schemaItemTriggeredId: '',
  }

  handleModalChange = (itemId) => {
    if (itemId.includes && itemId.includes('schemaItem')) { 
      const itemDetails = this.props.schemaItems[itemId];
      this.setState(({ schemaItemTriggered }) => ({ schemaItemTriggered: itemDetails })); 
      this.setState(({ schemaItemTriggeredId }) => ({ schemaItemTriggeredId: itemId })); 
    };
    this.setState(({ modalActive }) => ({ modalActive: !modalActive }));
  };

  addFakeItems = () => {
    this.props.addSchemaItem(FakeItems[1]);
    setTimeout(
      function() {
        this.props.addSchemaItem(FakeItems[2]);
      }
      .bind(this), 200);
    
  }

  render() {
    return (
      <Page>
        <Heading>Schema Generator</Heading>
        <Card>
          <ResourceList 
            resourceName={{singular: 'Schema Item', plural: 'Schema Items'}}
            items={Object.keys(this.props.schemaItems)}
            renderItem={(item) => {
              const itemValues = this.props.schemaItems[item];
              if (itemValues) return (
                <ResourceList.Item
                  id={item}
                  accessibilityLabel={`View details for ${itemValues.id}`}
                  onClick={this.handleModalChange}
                >
                  <SchemaItem item={itemValues} />
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
            schemaItemTriggeredId={this.state.schemaItemTriggeredId}
            schemaItems={this.props.schemaItems}
 
          />
          <Button onClick={this.addFakeItems}>Add fake schema items</Button>
          <AddSchemaModal addSchemaItem={this.props.addSchemaItem} />
        </Layout.AnnotatedSection>
      </Card>
    </Page>
    );
  }
}

export default PageLayout;