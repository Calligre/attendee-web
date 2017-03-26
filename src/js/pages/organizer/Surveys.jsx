import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Switch from 'react-toolbox/lib/switch';

import SurveyStore from 'stores/SurveyStore';
import PreferenceStore from 'stores/PreferenceStore';

export default class Surveys extends React.Component {
  constructor() {
    super();
    this.state = {
      surveys: [],
      enabled: PreferenceStore.getDefaults().survey,
      loaded: false,
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
    this.setState({
      enabled: !PreferenceStore.preferences.survey,
      loaded: true,
    });
  }

  showPreferenceError = () => {
    console.error(PreferenceStore.error);
  }

  handleChange = (name, value) => {
    PreferenceStore.update(name, value);
    this.setState({ enabled : value });
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
    const { surveys, enabled, loaded } = this.state;

    if (!loaded) {
      return (<div> Loading... </div>);
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
    };

    const selectRowProp = {
      mode: 'checkbox',
    };

    return (
      <div>
        <h1 className="primaryText">Surveys</h1>
		<Switch
          checked={enabled}
          label="Enable surveys on the home page"
          onChange={this.handleChange.bind(this, 'survey')}
        />
        <BootstrapTable
          data={surveys}
          cellEdit={cellEditProp}
          selectRow={selectRowProp}
          insertRow
          deleteRow
          striped
          hover
          options={tableOptions}
          className={enabled ? "" : "disabled"}>
          <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
          <TableHeaderColumn dataField='link' editable={ { validator: requireSurveyLink } }>Survey Link</TableHeaderColumn>
          <TableHeaderColumn dataField='description'>Description</TableHeaderColumn>
          <TableHeaderColumn isKey hidden hiddenOnInsert autoValue dataField='id'>Id</TableHeaderColumn>
        </BootstrapTable>
      </div>
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
