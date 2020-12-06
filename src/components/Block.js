import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { TextField, FormLayout, Form } from "@shopify/polaris";
import SettingsSection from "./SettingsSection";
import { uppercaseFirst } from "../utils/helpers";

class Block extends Component {
  static propTypes = {
    blockValues: PropTypes.object,
    id: PropTypes.string,
    handleModalChange: PropTypes.func,
  };

  handleFieldChange(field, value) {
    this.props.updateField(field, value, this.props.id);
  }

  render() {
    const activeFields = ["type", "name"];
    const { handleModalChange, fields, id } = this.props;
    const blockValues = fields[id] || {};

    return (
      <div>
        <Form>
          <FormLayout>
            {activeFields.map((field) => {
              return (
                <TextField
                  key={field}
                  label={uppercaseFirst(field)}
                  value={blockValues[field]}
                  onChange={(value) => this.handleFieldChange(field, value)}
                />
              );
            })}
            Settings
            <SettingsSection
              handleModalChange={handleModalChange}
              id={id}
              showSettingsButton={false}
            />
          </FormLayout>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  modal: state.modal,
  error: state.error,
  settings: state.settings.blocks,
  blocks: state.blocks,
  fields: state.fields,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateField: (field, value) => dispatch({
      type: "UPDATE_FIELD",
      field,
      value,
      id: ownProps.id,      
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Block);
