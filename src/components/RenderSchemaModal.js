import React, { Component } from "react";
import { Modal,  Button } from "@shopify/polaris";
import "../css/styles.css";



class RenderFieldModal extends Component {
  state = {
    active: false,
  }

  handleModalChange = () => {
    this.setState(({ active }) => ({ active: !active }));
  };

  getFieldJSON = () => {
    const removeQuotesRegex = new RegExp(/"(min|max|step)": "(\d*)"/gi);
    const { activeFields, fields } = this.props;

    let reorderedItems = {};

    activeFields.forEach(field => {
      if (fields[field] && fields[field].length > 0 ) { reorderedItems[field] = fields[field]}
    });

    let stringifiedFieldItems = JSON.stringify(reorderedItems, null, 2)
                                    .replace(removeQuotesRegex, '"$1": $2')


    stringifiedFieldItems = `{% schema %}\n` + stringifiedFieldItems + `\n{% endschema %}`
    
    return stringifiedFieldItems;
  }

  render() {
    const { active } = this.state;
    const fieldItemsJSON = this.getFieldJSON();

    return (
      <div>
        <Button onClick={this.handleModalChange}>Render JSON</Button>
        <Modal
          open={active}
          onClose={this.handleModalChange}
          title="Schema Section JSON"
          primaryAction={{
            content: "Close",
            onAction: this.handleModalChange
          }}
        >
          <Modal.Section>
            <textarea value={fieldItemsJSON} readOnly="readOnly" ></textarea>
          </Modal.Section>
        </Modal>
      </div>
    );
  }
}

export default RenderFieldModal;
