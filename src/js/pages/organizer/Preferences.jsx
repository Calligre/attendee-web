import React from 'react';

import PreferenceStore from 'stores/PreferenceStore.jsx';


export default class Preferences extends React.Component {
  constructor(props) {
    super(props);
    this.state = PreferenceStore.getDefaults();
    this.state.activeTab = 'pages';

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
    var key = event.target.name;
    var value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
    PreferenceStore.update(key, value);
    this.setState({ [key]: value });
  }

  handleTabSwitch = (event) => {
    this.setState({ activeTab: event.target.id });
  }

  render() {
    const { activeTab } = this.state;

    let tab = null;
    switch (activeTab) {
      case 'pages':
        tab = <TabPages {...this.state} handleChange={this.handleChange} />;
        break;
      case 'social':
        tab = <TabSocialMedia {...this.state} handleChange={this.handleChange} />;
        break;
      case 'cards':
        tab = <TabCards {...this.state} handleChange={this.handleChange}/>;
        break;
      case 'surveys':
        tab = <TabSurveys {...this.state} handleChange={this.handleChange}/>;
        break;
      case 'other':
        tab = <TabOther {...this.state} handleChange={this.handleChange}/>;
        break;
      default:
        null;
        break;
    }

    return (
      <div>
        <div className="sidebar">
          <div id="pages" onClick={this.handleTabSwitch}>Pages</div>
          <div id="social" onClick={this.handleTabSwitch}>Social Media</div>
          <div id="cards" onClick={this.handleTabSwitch}>Cards</div>
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

class TabCards extends React.Component {
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
          <label>Upcoming Events Card
            <input type="checkbox"
              name="events"
              onChange={this.props.handleChange}
              checked={this.state.events}
            />
          </label>
        </div>
        <div>
          <label>Content Card
            <input type="checkbox"
              name="content"
              onChange={this.props.handleChange}
              checked={this.state.content}
            />
          </label>
        </div>
        <div>
          <label>Contact Card
            <input type="checkbox"
              name="contact"
              onChange={this.props.handleChange}
              checked={this.state.contact}
            />
          </label>
        </div>
        <div>
          <label>Conference Location Card
            <input type="checkbox"
              name="location"
              onChange={this.props.handleChange}
              checked={this.state.location}
            />
          </label>
        </div>
        <div>
          <label>Map Card
            <input type="checkbox"
              name="map"
              onChange={this.props.handleChange}
              checked={this.state.map}
            />
          </label>
        </div>
        <div>
          <label>Package Card
            <input type="checkbox"
              name="package"
              onChange={this.props.handleChange}
              checked={this.state.package}
            />
          </label>
        </div>
      </div>
    );
  }
};

const TabSurveys = React.createClass({
  render() {
    return (<div>Surveys</div>);
  }
});

const TabOther = React.createClass({
  render() {
    return (<div>Other</div>);
  }
});
