import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, ResourceList, Stack } from "@shopify/polaris";
import SettingItem from "./SettingItem";

class SettingsSection extends Component {
  static propTypes = {
    id: PropTypes.string,
    handleModalChange: PropTypes.func,
    showSettingsButton: PropTypes.bool,
  };

  getSettings = (index) => {
    const settings = [];
    const { handleModalChange, id, moveSetting } = this.props;
    const numSettings = this.props.storeSettings[this.props.id]
      ? this.props.storeSettings[this.props.id].length
      : 0;

    if (numSettings === 0) return false;

    if (index > 0) {
      settings.push({
        content: "↑",
        onClick: () => moveSetting(index, index - 1),
      });
    }
    if (index !== numSettings - 1) {
      settings.push({
        content: "↓",
        onClick: () => moveSetting(index, index + 1),
      });
    }
    settings.push({
      // TODO: make this a better duplicate icon
      content: "⇉",
      onClick: () => handleModalChange("duplicate", id, index),
    });

    return settings;
  };

  render() {
    const { storeSettings, handleModalChange, id } = this.props;
    let settings = storeSettings[id];

    return (
      <>
        {settings && settings.length > 0 && (
          <ResourceList
            resourceName={{ singular: "Setting", plural: "Settings" }}
            items={settings}
            renderItem={(item) => {
              const index = settings.indexOf(item);
              if (item)
                return (
                  <ResourceList.Item
                    id={item.id}
                    accessibilityLabel={`View details for ${item.id}`}
                    onClick={() => handleModalChange("edit", id, index)}
                    shortcutActions={this.getSettings(index)}
                  >
                    <SettingItem id={index} item={item} />
                  </ResourceList.Item>
                );
            }}
          />
        )}

        {this.props.showSettingsButton && (
          <Stack distribution="center" alignment="trailing">
            <Button onClick={() => handleModalChange("add", id)}>
              New Setting Item
            </Button>
          </Stack>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  storeSettings: state.settings,
  modal: state.modal,
  error: state.error,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {     
    moveSetting: (index, destination) => dispatch({ 
      type: "MOVE_SETTING", 
      index, 
      destination, 
      id: ownProps.id
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsSection);
