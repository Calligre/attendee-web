import React from "react";
import $ from 'jquery';

import PeopleStore from "stores/PeopleStore";
import AuthService from "util/AuthService"
import Dropzone from 'react-dropzone';
import Clear from 'react-icons/lib/md/clear';
import Edit from 'react-icons/lib/md/mode-edit';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { profile: {id: 0}, preview: '', uploadInProgress: false, newPhoto: null };
    this.getProfile = this.getProfile.bind(this);
    this.submitChanges = this.submitChanges.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.cancelDrop = this.cancelDrop.bind(this);
    PeopleStore.getAll();
  }

  componentWillMount() {
    PeopleStore.on("received", this.getProfile);
    PeopleStore.on("error", this.showError);
  }

  componentWillUnmount() {
    PeopleStore.removeListener("received", this.getProfile);
    PeopleStore.removeListener("error", this.showError);
  }

  getProfile() {
    var id = AuthService.getCurrentUserId();
    if (this.props.params.hasOwnProperty("id")) {
      id = this.props.params.id;
    }
    var profiles = PeopleStore.people.filter((profile) => {
      return profile.id == id;
    })

    this.setState({
      profile: profiles[0],
      preview: profiles[0].photo,
    });

    $(".editableContainer").each(function(){
      var container = $(this);
      container.keyup(function(e) {
        var field = $(this);
        if (field.text().length == 0) {
          field.css('border-color', 'red');
          $('.submitChanges').prop('disabled', true);
        } else {
          field.css('border-color', 'black');
          $('.submitChanges').prop('disabled', false);
        }
      });
    });
  }

  showError(){
    console.log(PeopleStore.error);
  }

  onDrop(files) {
    this.setState({
      preview: files[0].preview,
      newPhoto: files[0],
      uploadInProgress: true
    })
  }
  
  cancelDrop(e) {
    e.stopPropagation();
    this.setState({
      preview: this.state.profile.photo,
      newPhoto: null,
      uploadInProgress: false
    });
  }

  submitChanges() {
    var form = $('.profile');
    var profile = {
      id: this.state.profile.id,
      description: form.find('.description').text(),
      organization: form.find('.organization').text(),
    };

    if (this.state.newPhoto != null) {
      PeopleStore.updatePhoto(profile.id, this.state.newPhoto);
    }
    PeopleStore.updatePerson(profile);
  }

  render() {
    if (this.state.profile.private) {
      return;
    }

    const {id, first_name, last_name, organization, points, description} = this.state.profile;

    // TODO: determine if this is my profile or not
    const myProfile = id == AuthService.getCurrentUserId();

    const displayCancel = myProfile && this.state.uploadInProgress ? "visible" : "hidden";
    const myProfileClass = myProfile ? "myProfile" : "";
    
    const buttonIcon = React.createElement(Clear, null);
    const editIcon = React.createElement(Edit, null);

    return (
      <div className={"profile " + myProfileClass}>
        <Dropzone className='dropzone' onDrop={this.onDrop} multiple={false} disableClick={!myProfile}>
          <img src={this.state.preview}/>
          <button className={"cancel " + displayCancel}  onClick={this.cancelDrop}>{buttonIcon}</button>
          <p className="label">Upload new photo</p>
        </Dropzone>
        <h2>{first_name} {last_name}</h2>
        <h4>Points: {points}</h4>
        <div className="editableContainer profileItem">
          <h3 contentEditable={myProfile} className="organization editable">{organization}</h3>
          <div className="editIcon">{editIcon}</div>
        </div>
        <div className="socialMediaContainer profileItem">
        </div>
        <div className="editableContainer profileItem">
          <p contentEditable={myProfile} className="description editable">{description}</p>
          <div className="editIcon">{editIcon}</div>
        </div>

        <button className="submitChanges" onClick={this.submitChanges}>Save changes</button>
      </div>
    );
  }
}
