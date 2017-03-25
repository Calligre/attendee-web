import React, { PropTypes } from 'react';
import $ from 'jquery';
import Dropzone from 'react-dropzone';
import Input from 'react-toolbox/lib/input';

import LinkedAccountsList from 'components/LinkedAccountsList';
import PeopleStore from 'stores/PeopleStore';
import AuthService from 'util/AuthService';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: { id: 0 },
      preview: '',
      uploadInProgress: false,
      newPhoto: null,
      organization: "",
      description: "",
    };
    PeopleStore.getAll();
    AuthService.on('profile_updated', (newProfile) => {
      this.getProfile();
    });
  }

  componentWillMount() {
    PeopleStore.on('received', this.getProfile);
    PeopleStore.on('error', this.showError);
  }

  componentWillUnmount() {
    PeopleStore.removeListener('received', this.getProfile);
    PeopleStore.removeListener('error', this.showError);
  }

  getProfile= () => {
    if (!AuthService.getProfile().identities) {
      return;
    }
    let id = AuthService.getCurrentUserId();
    if (this.props.params.hasOwnProperty('id')) {
      id = this.props.params.id;
    }
    const profiles = PeopleStore.people.filter(profile => profile.id === id);

    this.setState({
      profile: profiles[0],
      preview: profiles[0].photo,
      organization: profiles[0].organization,
      description: profiles[0].description,
    });

    $('.editableContainer').each(function () {
      const container = $(this);
      container.keyup(function (e) {
        const field = $(this);
        if (field.text().length === 0) {
          field.css('border-color', 'red');
          $('.submitChanges').prop('disabled', true);
        } else {
          field.css('border-color', 'black');
          $('.submitChanges').prop('disabled', false);
        }
      });
    });
  }

  showError = () => {
    console.log(PeopleStore.error);
  }

  onDrop = (files) => {
    this.setState({
      preview: files[0].preview,
      newPhoto: files[0],
      uploadInProgress: true,
    });
  }

  cancelDrop = (e) => {
    e.stopPropagation();
    this.setState({
      preview: this.state.profile.photo,
      newPhoto: null,
      uploadInProgress: false,
    });
  }

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  submitChanges = () => {
    const form = $('.profile');
    const profile = {
      id: this.state.profile.id,
      description: this.state.description,
      organization: this.state.organization,
    };

    if (this.state.newPhoto != null) {
      PeopleStore.updatePhoto(profile.id, this.state.newPhoto);
    }
    PeopleStore.updatePerson(profile);
  }

  renderLinkedAccountsList = (myProfile) => {
    if (myProfile) {
      return (
        <LinkedAccountsList profile={AuthService.getProfile()} />
      );
    }
    return null;
  }

  render() {
    if (this.state.profile.private || !AuthService.getProfile().identities) {
      return (<div><h2 className="primaryText">Loading</h2></div>);
    }

    const { id, first_name, last_name, organization, points, description, rank } = this.state.profile;

    // TODO: determine if this is my profile or not
    const myProfile = id === AuthService.getCurrentUserId();

    const displayCancel = myProfile && this.state.uploadInProgress ? 'visible' : 'hidden';
    const myProfileClass = myProfile ? 'myProfile' : '';

    return (
      <div className={`profile ${myProfileClass}`}>
        <Dropzone className="dropzone" onDrop={this.onDrop} multiple={false} disableClick={!myProfile}>
          <img src={this.state.preview} />
          <p className="label">Upload new photo</p>
        </Dropzone>
        <h2 className="primaryText">{first_name} {last_name}</h2>
        <h4>Points: {points}</h4>
        <h4>Rank: {rank}</h4>
        {this.renderLinkedAccountsList(myProfile)}
        <Input type='text' label='Organization' name='organization' value={this.state.organization} onChange={this.handleChange.bind(this, 'organization')} />
        <Input type='text' label='About you' name='description' value={this.state.description} onChange={this.handleChange.bind(this, 'description')} />
        <button className="secondaryBackground submitChanges" onClick={this.submitChanges}>Save changes</button>
      </div>
    );
  }
}
