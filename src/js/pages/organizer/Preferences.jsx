import React from 'react';

import PreferenceStore from 'stores/PreferenceStore.jsx';


export default class Preferences extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'pages',
      newsfeed: false,
      cards: false,
      info: false,
      facebook: false,
      twitter: false,
      reposts: false,
    };

    PreferenceStore.loadAll();
  }

  componentWillMount = () => {
    PreferenceStore.on('loaded', this.resetState);
    PreferenceStore.on('error', this.showError);
  }

  componentWillUnmount = () => {
    PreferenceStore.removeListener('loaded', this.resetState);
    PreferenceStore.removeListener('error', this.showError);
  }

  resetState = () => {
    this.setState(PreferenceStore.preferences);
  }

  showError = () => {
    console.log(PreferenceStore.error);
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCheckboxChange = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
  }

  handleTabSwitch = (event) => {
    this.setState({ activeTab: event.target.id });
  }

  render() {
    const { activeTab } = this.state;

    let tab = null;
    switch (activeTab) {
      case 'pages':
        tab = <TabPages {...this.state} handleChange={this.handleCheckboxChange} />;
        break;
      case 'social-media':
        tab = <TabSocialMedia {...this.state} handleChange={this.handleCheckboxChange} />;
        break;
      case 'surveys':
        tab = <TabSurveys/>;
        break;
      case 'other':
        tab = <TabOther/>;
        break;
      default:
        null;
        break;
    }

    return (
      <div>
        <div className="sidebar">
          <div id="pages" onClick={this.handleTabSwitch}>Pages</div>
          <div id="social-media" onClick={this.handleTabSwitch}>Social Media</div>
          <div id="surveys" onClick={this.handleTabSwitch}>Surveys</div>
          <div id="other" onClick={this.handleTabSwitch}>Other</div>
        </div>
        {tab}
      </div>
    );
  }
}

class TabPages extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(props) {
    this.state = props;
  }

  render() {
    return (
      <div>
        <div>
          <label>Newsfeed
            <input type="checkbox"
              name="newsfeed"
              onChange={this.props.handleChange}
              checked={this.state.newsfeed}
            />
          </label>
        </div>
      </div>
    );
  }
}

class TabSocialMedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(props) {
    this.state = props;
  }

  render() {
    return (
      <div>
        <div>
          <label>Faceboox
            <input type="checkbox"
              name="facebook"
              onChange={this.props.handleChange}
              checked={this.state.facebook}
            />
          </label>
        </div>
        <div>
          <label>Twitter
            <input type="checkbox"
              name="twitter"
              onChange={this.props.handleChange}
              checked={this.state.twitter}
            />
          </label>
        </div>
        <div>
          <label>Reposts
            <input type="checkbox"
              name="reposts"
              onChange={this.props.handleChange}
              checked={this.state.reposts}
            />
          </label>
        </div>

      </div>
    );
  }
};

const TabSurveys = React.createClass({
  render() {
    <div>Surveys</div>
  }
});

const TabOther = React.createClass({
  render() {
    <div>Other</div>
  }
});
