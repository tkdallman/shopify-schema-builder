import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Card, Collapsible, Stack, TextField } from "@shopify/polaris";
import Block from "./Block";

class Blocks extends Component {
  static propTypes = {
    handleModalChange: PropTypes.func,
  };

  addBlock() {
    const id = `block_${Date.now()}`;
    this.props.addBlock(id);
    this.props.addFields(id);
    this.props.addSetting(id);
  }

  deleteBlock(index, blockId) {
    this.props.deleteBlock(index);
    this.props.deleteAllSettings(blockId);
    this.props.deleteAllFields(blockId);
  }

  updateMaxBlocks(value) {
    this.props.updateField("maxBlocks", parseInt(value));
  }

  handleToggleClick(index, isOpen) {
    this.props.toggleBlock(index, isOpen);
  }

  render() {
    const { blocks, fields, handleModalChange } = this.props;

    return (
      <>
        {blocks.map((block, index) => {
          return (
            <Card sectioned key={block.id}>
              <Collapsible open={block.isOpen} id="basic-collapsible">
                <Block
                  key={block.id}
                  blockValues={block}
                  id={block.id}
                  handleModalChange={handleModalChange}
                />
              </Collapsible>
              <Stack distribution="center">
                <Button onClick={() => this.deleteBlock(index, block.id)}>
                  Delete Block
                </Button>
                <Button onClick={() => handleModalChange("add", block.id)}>
                  New Setting Item
                </Button>
                <Button
                  onClick={() => this.handleToggleClick(index, !block.isOpen)}
                  ariaExpanded={"open0"}
                  ariaControls="basic-collapsible"
                >
                  {block.isOpen ? "⇧" : "⇩"}
                </Button>
              </Stack>
            </Card>
          );
        })}

        <Card sectioned>
          <Stack distribution="center" alignment="trailing">
            <Button onClick={() => this.addBlock()}>Add New Block</Button>
            {blocks.length > 0 && (
              <TextField
                key={"max_blocks"}
                label={"Max Blocks"}
                type="number"
                min="1"
                value={fields.store.maxBlocks}
                onChange={(value) => this.updateMaxBlocks(value)}
              />
            )}
          </Stack>
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  storeSettings: state.settings.blocks,
  modal: state.modal,
  error: state.error,
  blocks: state.blocks,
  fields: state.fields,
});

const mapDispatchToProps = (dispatch) => {
  return {     
    addBlock: (id ) => dispatch({ type: 'ADD_BLOCK', id }),
    addFields: (id ) => dispatch({ type: 'ADD_FIELDS', id }),
    addSetting: (id ) => dispatch({ type: 'ADD_SETTING', id }),
    updateField: (field, value, id) => dispatch({ type: "UPDATE_FIELD", field, value, id }),
    toggleBlock: (index, isOpen) => dispatch({ type: 'TOGGLE_BLOCK', index, setting: isOpen }),
    deleteBlock: (index ) => dispatch({ type: 'DELETE_BLOCK', index }),
    deleteAllSettings: (id) =>dispatch({ type:'DELETE_ALL_SETTINGS', id }),
    deleteAllFields: (id) => dispatch({ type: 'DELETE_ALL_FIELDS', id }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Blocks);
