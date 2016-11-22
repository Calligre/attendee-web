import React from 'react';

export default class Preferences extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newsfeed: false,
      cards: false,
      info: false,
      facebook: false,
      twitter: false,
      reposts: false,
    };
  }

  componentWillMount() {
    PreferenceStored.on('received', this.getPeople);
    PreferenceStore.on('error', this.showError);
  }

  componentWillUnmount() {
    PreferenceStored.removeListener('received', this.getPeople);
    PreferenceStore.removeListener('error', this.showError);
  }

  getPeople = () => {
    this.setState(PreferenceStore.preferences);
  }

  showError() {
    console.log(PreferenceStore.error);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div> Preferences </div>

    );
  }
}