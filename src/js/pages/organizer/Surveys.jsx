import React from 'react';

import PreferenceStore from 'stores/PreferenceStore';

export default class Surveys extends React.Component {
  constructor() {
    super();
    this.state = {
      surveys: [],
      disabled: PreferenceStore.getDefaults().survey,
    };

    PreferenceStore.loadAll();
  }

  componentWillMount() {
    PreferenceStore.on('loaded', this.loadPreferences);
    PreferenceStore.on('error', this.showError);
  }

  componentWillUnmount() {
    PreferenceStore.removeListener('loaded', this.loadPreferences);
    PreferenceStore.removeListener('error', this.showError);
  }

  loadPreferences = () => {
    this.setState({ disabled: !PreferenceStore.preferences.survey });
  }

  showError = () => {
    console.error(PreferenceStore.error);
  }

  render() {
    const { surveys, disabled } = this.state;

    if (disabled) {
      return (<div> Surveys have been disabled, please check your preferences. </div>);
    }


    return (
      <div>Surveys </div>
    );
  }

}
