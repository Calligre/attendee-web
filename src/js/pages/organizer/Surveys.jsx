import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import SurveyStore from 'stores/SurveyStore';
import PreferenceStore from 'stores/PreferenceStore';

export default class Surveys extends React.Component {
  constructor() {
    super();
    this.state = {
      surveys: [],
      disabled: PreferenceStore.getDefaults().survey,
    };

    SurveyStore.getAll();
    PreferenceStore.loadAll();
  }

  componentWillMount() {
    SurveyStore.on('loaded', this.loadSurveys);
    SurveyStore.on('created', this.loadSurveys);
    SurveyStore.on('error', this.showError);
    PreferenceStore.on('loaded', this.loadPreferences);
    PreferenceStore.on('error', this.showPreferenceError);
  }

  componentWillUnmount() {
    SurveyStore.removeListener('loaded', this.loadSurveys);
    SurveyStore.removeListener('created', this.loadSurveys);
    SurveyStore.removeListener('error', this.showError);
    PreferenceStore.removeListener('loaded', this.loadPreferences);
    PreferenceStore.removeListener('error', this.showPreferenceError);
  }

  loadSurveys = () => {
    this.setState({ surveys: SurveyStore.surveys });
  }

  showError = () => {
    console.error(SurveyStore.error);
  }

  loadPreferences = () => {
    this.setState({ disabled: !PreferenceStore.preferences.survey });
  }

  showPreferenceError = () => {
    console.error(PreferenceStore.error);
  }

  updateSurvey = (row) => {
    SurveyStore.update(row);
  }

  addSurvey = (row) => {
    SurveyStore.create(row);
  }

  deleteSurvey = (row) => {
    row.forEach(id => SurveyStore.delete(id));
  }

  render() {
    const { surveys, disabled } = this.state;

    if (disabled) {
      return (<div> Surveys have been disabled, please check your preferences. </div>);
    }

    const cellEditProp = {
      mode: 'click',
      blueToSave: true,
      afterSaveCell: this.updateSurvey,
    };


    const tableOptions = {
      afterInsertRow: this.addSurvey,
      afterDeleteRow: this.deleteSurvey,
      handleConfirmDeleteRow: removeAlertOnDelete,
    }

    const selectRowProp = {
      mode: 'checkbox',
    };

    return (
      <BootstrapTable
        data={surveys}
        cellEdit={cellEditProp}
        selectRow={selectRowProp}
        insertRow
        deleteRow
        striped
        hover
        options={tableOptions}>
        <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
        <TableHeaderColumn dataField='link' editable={ { validator: requireSurveyLink } }>Survey Link</TableHeaderColumn>
        <TableHeaderColumn dataField='description'>Description</TableHeaderColumn>
        <TableHeaderColumn isKey hidden hiddenOnInsert autoValue dataField='id'>Id</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

function removeAlertOnDelete(next, dropRowKeys) {
  next();
}

function requireSurveyLink(value) {
  const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
  if (!value) {
    response.isValid = false;
    response.notification.type = 'error';
    response.notification.msg = 'A link to a google survey is required';
    response.notification.title = 'Requested Value';
  }
  return response;
}