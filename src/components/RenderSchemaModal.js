import React, { Component } from "react";
import { Modal,  Button } from "@shopify/polaris";
import "../css/styles.css";



class RenderSchemaModal extends Component {
  state = {
    active: false,
  }

  handleModalChange = () => {
    this.setState(({ active }) => ({ active: !active }));
  };
  
  copyCode = () => {
    console.log('copy code');

  }

  getSchemaJSON = () => {
    const removeQuotesRegex = new RegExp(/"(min|max|step)": "(\d*)"/gi);
    let stringifiedSchemaItems = JSON.stringify(this.props.schemaItems, null, 2)
                                       .replace(removeQuotesRegex, '"$1": $2')
                                       .slice(1)

    stringifiedSchemaItems = stringifiedSchemaItems.slice(0, -1);

    stringifiedSchemaItems = `{% schema %}\n` + stringifiedSchemaItems + `\n{% endschema %}`
    
    return stringifiedSchemaItems;
  }

  render() {
    const { active } = this.state;
    const schemaItemsJSON = this.getSchemaJSON();

    return (
      <div>
        <Button onClick={this.handleModalChange}>Render Schema</Button>
        <Modal
          open={active}
          onClose={this.handleModalChange}
          title="Add schema section"
          primaryAction={{
            content: "Copy",
            onAction: this.copyCode
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: this.handleModalChange
            }
          ]}
        >
          <Modal.Section>
            <textarea value={schemaItemsJSON} readOnly="readOnly" ></textarea>
          </Modal.Section>
        </Modal>
      </div>
    );
  }
}

export default RenderSchemaModal;
