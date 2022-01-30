import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Layout,
  Page,
  Card,
  TextField,
  FormLayout,
  Form,
  Stack,
  TextContainer,
} from "@shopify/polaris";
import RenderSchemaModal from "./RenderSchemaModal";
import Blocks from "./Blocks";
import SettingsSection from "./SettingsSection";
import SettingsModal from "./SettingsModal";
import { uppercaseFirst } from "../utils/helpers";

const types = require("../data/types.json");

class PageLayout extends Component {
  state = {
    modalActive: false,
    modalType: "",
    settingItemTriggered: {},
    settings: { type: "Pick an Option" },
    blockTriggeredIndex: undefined,
    idError: false,
  };

  handleModalChange = (modalChangeType, id, index) => {
    let itemDetails, selectedItem;
    if (["edit", "duplicate"].includes(modalChangeType)) {
      selectedItem = this.props.storeSettings[id][index];
    }

    itemDetails = selectedItem
      ? JSON.parse(JSON.stringify(selectedItem))
      : null;

    switch (modalChangeType) {
      case "edit":
        this.props.modalEdit(itemDetails, index, id);
        break;
      case "duplicate":
        this.props.modalDuplicate(itemDetails, id);
        break;

      case "add":
        this.setState(({ idError }) => ({ idError: true }));
        this.props.setErrorState(false);
        this.props.modalAdd(id);
        break;
      default:
        return false;
    }
  };

  render() {
    // TODO: integrate other 'types' of schema objects
    const activeFields = Object.keys(types["section"]);

    const textFields = ["name", "class", "tag"];
    const { mainFields, updateValue } = this.props;

    return (
      <Page title="Maison Commerce | Shopify Schema Maker">
        <Layout>
          <Layout.AnnotatedSection
            title="Section details"
            description="A number of the common section details here"
          >
            <Card sectioned>
              <TextContainer>
                <Form>
                  <FormLayout>
                    {activeFields.map((field) => {
                      if (textFields.includes(field))
                        return (
                          <TextField
                            key={field}
                            label={uppercaseFirst(field)}
                            value={mainFields[field]}
                            onChange={(value) => updateValue(field, value)}
                          />
                        );
                      return <p key={field}></p>;
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
              <SettingsSection
                id={"store"}
                handleModalChange={this.handleModalChange}
                showSettingsButton={true}
              />
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title="Blocks"
            description="optional setting"
          >
            {activeFields.includes("blocks") && (
              <Blocks handleModalChange={this.handleModalChange} />
            )}
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection>
            <Card sectioned>
              <Stack distribution="center" alignment="trailing">
                <RenderSchemaModal
                  activeFields={Object.keys(types["section"])}
                />
              </Stack>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>

        <SettingsModal />
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  storeSettings: state.settings,
  modal: state.modal,
  error: state.error,
  fields: state.fields,
  mainFields: state.fields.store,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setErrorState: (errorState) => dispatch({
      type: "SET_ERROR_STATE",
      errorState
    }),
    modalEdit: (itemDetails, index, id) => dispatch({
      type: "MODAL_ACTIVE",
      modalActive: true,
      modalType: "edit",
      item: itemDetails,
      index,
      id,          
    }),
    modalAdd: (id) => dispatch({
      type: "MODAL_ACTIVE",
      modalActive: true,
      modalType: "add",
      item: null,
      index: null,
      id,
    }),
    modalDuplicate: (itemDetails, id) => dispatch({
      type: "MODAL_ACTIVE",
      modalActive: true,
      modalType: "duplicate",
      item: itemDetails,
      index: null,
      id,      
    }),
    updateValue: (field, value) => dispatch({
      type: "UPDATE_FIELD",
      id: "store",
      field,
      value,    
    })
  }
} 

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout);
