import React, { PropTypes } from 'react';
import $ from 'jquery';
import Dropzone from 'react-dropzone';
import Input from 'react-toolbox/lib/input';

import SocialMediaList from 'components/SocialMediaList';
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
      facebook: "",
      twitter: "",
      linkedin: "",
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

  componentDidUpdate(prevProps, prevState) {
    let oldId = -1;
    let newId = -1;
    if (prevProps.params.hasOwnProperty('id')) {
      oldId = prevProps.params.id;
    }
    if (this.props.params.hasOwnProperty('id')) {
      newId = this.props.params.id;
    }
    if (oldId != newId) {
      this.getProfile();
    }
  }

  getProfile = () => {
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
      facebook: profiles[0].facebook,
      twitter: profiles[0].twitter,
      linkedin: profiles[0].linkedin,
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
      facebook: this.state.facebook,
      twitter: this.state.twitter,
      linkedin: this.state.linkedin,
    };

    if (this.state.newPhoto != null) {
      PeopleStore.updatePhoto(profile.id, this.state.newPhoto);
    }
    PeopleStore.updatePerson(profile);
  }

  renderSocialMediaList = () => {
    if (this.state.facebook || this.state.twitter || this.state.linkedin) {
      return (
        <SocialMediaList profile={{
          facebook: this.state.facebook,
          twitter: this.state.twitter,
          linkedin: this.state.linkedin,
        }} />
      );
    }
    return null;
  }

  render() {
    if (this.state.profile.private || !AuthService.getProfile().identities) {
      return (<div><h2 className="primaryText">Loading</h2></div>);
    }

    const { id, first_name, last_name, organization, points, description, rank } = this.state.profile;

    const myProfile = id === AuthService.getCurrentUserId();

    const displayCancel = myProfile && this.state.uploadInProgress ? 'visible' : 'hidden';
    const myProfileClass = myProfile ? 'myProfile' : '';

    return (
      <div className={`profile ${myProfileClass}`}>
        <Dropzone className="dropzone" onDrop={this.onDrop} multiple={false} disableClick={!myProfile}>
          <div className="profilePic" style={{backgroundImage: "url(" + this.state.preview + ")"}} />
          <p className="label">Upload new photo</p>
        </Dropzone>
        <h2 className="primaryText">{first_name} {last_name}</h2>
        <h4>Points: {points}</h4>
        <h4>Rank: {rank}</h4>
        { this.renderSocialMediaList() }
        { (myProfile || this.state.organization.length > 0) &&
          <Input type='text' label='Organization' name='organization' value={this.state.organization} onChange={this.handleChange.bind(this, 'organization')} disabled={!myProfile}/>
        }
        { (myProfile || this.state.description.length > 0) &&
          <Input type='text' label='About you' name='description' value={this.state.description} onChange={this.handleChange.bind(this, 'description')} disabled={!myProfile}/>
        }
        { myProfile &&
          <div>
            <div className="socialMediaInput">
              <div className="prefix">facebook.com/</div>
              <Input type='text' label='Facebook' name='facebook' value={this.state.facebook} onChange={this.handleChange.bind(this, 'facebook')} disabled={!myProfile}/>
            </div>
            <div className="socialMediaInput">
              <div className="prefix">@</div>
              <Input type='text' label='Twitter' name='twitter' value={this.state.twitter} onChange={this.handleChange.bind(this, 'twitter')} disabled={!myProfile}/>
            </div>
            <div className="socialMediaInput">
              <div className="prefix">linkedin.com/</div>
              <Input type='text' label='LinkedIn' name='linkedin' value={this.state.linkedin} onChange={this.handleChange.bind(this, 'linkedin')} disabled={!myProfile}/>
            </div>
          </div>
        }
        <button className="secondaryBackground submitChanges" onClick={this.submitChanges}>Save changes</button>
      </div>
    );
  }
}
