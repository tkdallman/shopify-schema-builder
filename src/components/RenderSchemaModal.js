import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "@shopify/polaris";
import "../css/styles.css";
import PropTypes from "prop-types";

class RenderFieldModal extends Component {
  state = {
    modalActive: false,
  };

  static propTypes = {
    activeFields: PropTypes.array
  }

  handleModalChange = () => {
    this.setState(({ modalActive }) => ({ modalActive: !modalActive }));
  };

  getFieldJSON = () => {
    const removeQuotesRegex = new RegExp(/"(min|max|step)": "(\d*)"/gi);
    const { fields, settings, blocks } = this.props;

    const reorderedBlocks =
      blocks.length === 0
        ? null
        : blocks.map(({ id }) => {
            return { ...fields[id], settings: settings[id] };
          });

    const reorderedObject = {
      ...fields.store,
      settings: settings.store,
      ...(blocks.length > 0 && { blocks: reorderedBlocks }),
    };

    let stringifiedFieldItems = JSON.stringify(
      reorderedObject,
      null,
      2
    ).replace(removeQuotesRegex, '"$1": $2');

    stringifiedFieldItems =
      `{% schema %}\n` + stringifiedFieldItems + `\n{% endschema %}`;

    return stringifiedFieldItems;
  };

  render() {
    const { modalActive } = this.state;
    const fieldItemsJSON = this.getFieldJSON();

    return (
      <div>
        <Button onClick={this.handleModalChange}>Render JSON</Button>
        <Modal
          open={modalActive}
          onClose={this.handleModalChange}
          title="Schema Section JSON"
          primaryAction={{
            content: "Close",
            onAction: this.handleModalChange,
          }}
        >
          <Modal.Section>
            <textarea value={fieldItemsJSON} readOnly="readOnly"></textarea>
          </Modal.Section>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  settings: state.settings,
  modal: state.modal,
  error: state.error,
  blocks: state.blocks,
  fields: state.fields,
});

export default connect(mapStateToProps)(RenderFieldModal);
