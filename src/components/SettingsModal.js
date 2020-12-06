import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "@shopify/polaris";
import AddSettingForm from "./AddSettingForm";
import EditSettingForm from "./EditSettingForm";
import { removeExtraneous, uppercaseFirst } from "../utils/helpers";

const sections = require("../data/sections.json");

class SettingsModal extends Component {
  state = {
    settings: { type: "Pick an Option" },
  };

  deleteItem = () => {
    const {
      modal: { id, index },
    } = this.props;

    this.props.deleteSetting(id, index);

    this.handleClose();
  };

  handleSettingChange = (change, value) => {
    const newSettings = { ...this.state.settings };
    const changeType = change.changeType;

    switch (changeType) {
      case "editOption":
        newSettings.options[change.index][change.attribute] = value;
        break;

      case "removeOption":
        newSettings.options.splice(change.index, 1);
        break;

      case "addOption":
        newSettings.options.push({});
        break;

      case "editInput":
        const itemsWithOptions = ["radio", "select"];

        if (itemsWithOptions.includes(value)) {
          newSettings.options = [{}];
        }

        newSettings[change.input] = value;
        break;

      default:
        return false;
    }

    this.setState(({ settings }) => ({ settings: newSettings }));
  };

  updateAndClose() {
    const {
      error,
      savedSettings,
      modal: { modalType, index, id },
    } = this.props;
    const { settings } = this.state;

    let errorState = false;
    const settingIds = savedSettings[id].map((setting) => setting.id);

    // add error checking for block IDs
    if (modalType !== "edit") {
      if (
        settingIds.includes(settings.id) ||
        !settings.id ||
        settings.id === ""
      )
        errorState = true;
      if (error.errorState !== errorState) {
        this.props.setErrorState(errorState);
      }
    }

    if (errorState) return;

    if (modalType === "edit") {
      const updatedSettingItem = settings;
      const settingItemProperties = [
        "type",
        ...Object.keys(sections[updatedSettingItem.type]),
      ];
      const settingItemWithoutExtraneous = removeExtraneous(
        updatedSettingItem,
        settingItemProperties
      );

      if (
        settingItemWithoutExtraneous.type === "radio" &&
        settingItemWithoutExtraneous.options
      ) {
        settingItemWithoutExtraneous.options = settingItemWithoutExtraneous.options.map(
          (option) => {
            return removeExtraneous(option, ["value", "label"]);
          }
        );
      }

      this.props.updateSetting(settingItemWithoutExtraneous, index, id)
    } else {
      const settingItem = {};
      const settingItemProperties = Object.keys(sections[settings.type]);

      Object.keys(settings)
        .filter(
          (item) => settingItemProperties.includes(item) || item === "type"
        )
        .forEach((item) => {
          settingItem[item] = settings[item];
        });

      this.props.addSetting(settingItem, id);
    }

    this.handleClose();
  }

  handleClose = () => {
    this.props.setErrorState(false);

    this.props.closeModal();
    this.setState(({ settings }) => ({ settings: { type: "Pick an Option" } }));
  };

  render() {
    const {
      modal: { modalActive, modalType },
    } = this.props;

    if (!modalActive || !modalType) return false;


    return (
      <Modal
        open={modalActive}
        onClose={this.handleClose}
        title={`${modalType ? uppercaseFirst(modalType) : ""} Setting`}
        primaryAction={{
          content: "Confirm",
          onAction: () => this.updateAndClose(),
        }}
        secondaryActions={modalType === 'edit' && [
          {
            content: "Delete item",
            onAction: this.deleteItem,
          },
        ]}
      >
        <Modal.Section>
          {modalType === "edit" && (
            <EditSettingForm
              preloadData={(newSettings) =>
                this.setState(({ settings }) => ({ settings: newSettings }))
              }
              settingItemTriggered={this.props.settingItemTriggered}
              updateAndClose={this.updateAndClose}
              settings={this.state.settings}
              handleSettingChange={this.handleSettingChange}
              idError={this.props.idError}
            />
          )}
          {modalType === "duplicate" && (
            <AddSettingForm
              preloadData={(newSettings) =>
                this.setState(({ settings }) => ({ settings: newSettings }))
              }
              updateAndClose={this.updateAndClose}
              handleSettingChange={this.handleSettingChange}
              idError={this.props.idError}
              settings={this.state.settings}
            />
          )}
          {modalType === "add" && (
            <AddSettingForm
              updateAndClose={this.updateAndClose}
              handleSettingChange={this.handleSettingChange}
              idError={this.props.idError}
              settings={this.state.settings}
            />
          )}
        </Modal.Section>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  modal: state.modal,
  error: state.error,
  savedSettings: state.settings,
});

const mapDispatchToProps = (dispatch) => {
  return {
    deleteSetting: (id, index) => dispatch({ type: 'DELETE_SETTING', id, index}),
    setErrorState: (errorState) => dispatch({ type: 'SET_ERROR_STATE', errorState }),
    updateSetting: (updatedSetting, index, id) => dispatch({ 
      type: "UPDATE_SETTING",
      setting: updatedSetting,
      index,
      id,
    }),
    addSetting: (setting, id) => dispatch({
      type: "ADD_SETTING", 
      setting,
      id,
    }),
    closeModal: () => dispatch({
      type: "MODAL_ACTIVE",
      modalActive: false,
      modalType: null,
      item: null,
      index: null,
      blockIndex: null,
      id: null
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
