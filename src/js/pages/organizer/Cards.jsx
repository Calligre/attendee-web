import React from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import BrandStore from "stores/BrandStore";
import PreferenceStore from 'stores/PreferenceStore';
import Switch from 'react-toolbox/lib/switch';
import Input from 'react-toolbox/lib/input';

export default class Cards extends React.Component {

  constructor() {
    super();
    this.state = {
      cards: [],
      locations: [],
      contacts: [],
      sponsors: [],
      map: "",
      package: "",
      preferences: PreferenceStore.getDefaults(),
    };

    BrandStore.getAll();
    PreferenceStore.loadAll();
  }

  componentWillMount() {
    BrandStore.on("receivedBranding", this.loadBranding);
    BrandStore.on("receivedCards", this.getCards);
    BrandStore.on("addCards", this.getCards);
    BrandStore.on("updateCards", this.getCards);
    BrandStore.on("deleteCards", this.getCards);
    BrandStore.on("receivedContacts", this.getContacts);
    BrandStore.on("addContacts", this.getContacts);
    BrandStore.on("updateContacts", this.getContacts);
    BrandStore.on("deleteContacts", this.getContacts);
    BrandStore.on("receivedLocations", this.getLocations);
    BrandStore.on("addLocations", this.getLocations);
    BrandStore.on("updateLocations", this.getLocations);
    BrandStore.on("deleteLocations", this.getLocations);
    BrandStore.on("receivedSponsors", this.getSponsors);
    BrandStore.on("addSponsors", this.getSponsors);
    BrandStore.on("updateSponsors", this.getSponsors);
    BrandStore.on("deleteSponsors", this.getSponsors);
    BrandStore.on("error", this.showError);
    PreferenceStore.on('loaded', this.loadPreferences);
    PreferenceStore.on('error', this.showError);
  }

  componentWillUnmount() {
    BrandStore.removeListener("receivedBranding", this.loadBranding);
    BrandStore.removeListener("receivedCards", this.getCards);
    BrandStore.removeListener("addCards", this.getCards);
    BrandStore.removeListener("updateCards", this.getCards);
    BrandStore.removeListener("deleteCards", this.getCards);
    BrandStore.removeListener("receivedContacts", this.getContacts);
    BrandStore.removeListener("addContacts", this.getContacts);
    BrandStore.removeListener("updateContacts", this.getContacts);
    BrandStore.removeListener("deleteContacts", this.getContacts);
    BrandStore.removeListener("receivedLocations", this.getLocations);
    BrandStore.removeListener("addLocations", this.getLocations);
    BrandStore.removeListener("updateLocations", this.getLocations);
    BrandStore.removeListener("deleteLocations", this.getLocations);
    BrandStore.removeListener("receivedSponsors", this.getSponsors);
    BrandStore.removeListener("addSponsors", this.getSponsors);
    BrandStore.removeListener("updateSponsors", this.getSponsors);
    BrandStore.removeListener("deleteSponsors", this.getSponsors);
    BrandStore.removeListener("error", this.showError);
    PreferenceStore.removeListener('loaded', this.loadPreferences);
    PreferenceStore.removeListener('error', this.showError);
  }

  showError = () => {
    console.log(BrandStore.error);
    console.log(PreferenceStore.error);
  }

  handleChange = (field, value) => {
    PreferenceStore.update(field, value);
    let updatedPreferences = this.state.preferences;
    updatedPreferences[field] = value;
    this.setState({ preferences: updatedPreferences });
  }

  updateBranding = (name, value) => {
    BrandStore.update(name, value);
    this.setState({ [name]: value });
  }

  loadPreferences = () => {
    this.setState({ preferences: PreferenceStore.preferences });
  }

  loadBranding = () => {
    this.setState({
      map: BrandStore.branding.map,
      package: BrandStore.branding.package,
    });
  }

  generateCard = (row) => {
    var updatedCard = {
      id: -1,
      data: "",
    }
    for (const prop in row) {
      updatedCard[prop] = row[prop];
    }
    return updatedCard;
  }

  generateLocation = (row) => {
    var updatedLocation = {
      id: -1,
      name: "",
      address: "",
    }
    for (const prop in row) {
      updatedLocation[prop] = row[prop];
    }
    return updatedLocation;
  }

  generateContact = (row) => {
    var updatedLocation = {
      id: -1,
      name: "",
      phone: "",
    }
    for (const prop in row) {
      updatedLocation[prop] = row[prop];
    }
    return updatedLocation;
  }

  generateSponsor = (row) => {
    var updatedSponsor = {
      id: -1,
      rank: 0,
      level: "",
      logo: "",
      name: "",
      website: "",
    }
    for (const prop in row) {
      updatedSponsor[prop] = row[prop];
    }
    return updatedSponsor;
  }

  updateCard = (row, cellName, cellValue) => {
    BrandStore.updateCard(this.generateCard(row));
  }

  addCard = (row) => {
    BrandStore.addCard(this.generateCard(row));
  }

  deleteCards = (rowKeys) => {
    for (const key in rowKeys) {
      BrandStore.deleteCard(rowKeys[key])
    }
  }

  getCards = () => {
    this.setState({
      cards: BrandStore.cards,
    });
  }

  updateContact = (row, cellName, cellValue) => {
    BrandStore.updateContact(this.generateContact(row));
  }

  addContact = (row) => {
    BrandStore.addContact(this.generateContact(row));
  }

  deleteContacts = (rowKeys) => {
    for (const key in rowKeys) {
      this.cards = BrandStore.deleteContact(rowKeys[key])
    }
  }

  getContacts = () => {
    this.setState({
      contacts: BrandStore.contacts,
    });
  }

  updateLocation = (row, cellName, cellValue) => {
    BrandStore.updateLocation(this.generateLocation(row));
  }

  addLocation = (row) => {
    BrandStore.addLocation(this.generateLocation(row));
  }

  deleteLocations = (rowKeys) => {
    for (const key in rowKeys) {
      BrandStore.deleteLocation(rowKeys[key])
    }
  }

  getLocations = () => {
    this.setState({
      locations: BrandStore.locations,
    });
  }

  updateSponsor = (row, cellName, cellValue) => {
    BrandStore.updateSponsor(this.generateSponsor(row));
  }

  addSponsor = (row) => {
    BrandStore.addSponsor(this.generateSponsor(row));
  }

  deleteSponsors = (rowKeys) => {
    for (const key in rowKeys) {
      BrandStore.deleteSponsor(rowKeys[key])
    }
  }

  getSponsors = () => {
    this.setState({
      sponsors: BrandStore.sponsors,
    });
  }

  render() {
    const { preferences } = this.state;

    const selectRowProp = {
      mode: 'checkbox'
    };
    const cellEditPropCards = {
      mode: 'click',
      afterSaveCell: this.updateCard,
    };
    const optionsCards = {
      afterInsertRow: this.addCard,
      afterDeleteRow: this.deleteCards,
    };
    const cellEditPropContacts = {
      mode: 'click',
      afterSaveCell: this.updateContact,
    };
    const optionsContacts = {
      afterInsertRow: this.addContact,
      afterDeleteRow: this.deleteContacts,
    };
    const cellEditPropLocations = {
      mode: 'click',
      afterSaveCell: this.updateLocation,
    };
    const optionsLocations = {
      afterInsertRow: this.addLocation,
      afterDeleteRow: this.deleteLocations,
    };
    const cellEditPropSponsors = {
      mode: 'click',
      afterSaveCell: this.updateSponsor,
    };
    const optionsSponsors = {
      afterInsertRow: this.addSponsor,
      afterDeleteRow: this.deleteSponsors,
    };

    return (
      <div>
        <h1 className="primaryText">Cards</h1>
        <h2 className="secondaryText largeTopMargin">Upcoming Events</h2>
		<Switch
          checked={this.state.preferences.events}
          label="Show cards for users' upcoming events"
          onChange={this.handleChange.bind(this, 'events')}
        />

        <h2 className="secondaryText largeTopMargin">Map</h2>
		<Switch
          checked={this.state.preferences.map}
          label="Show card with link to download map"
          onChange={this.handleChange.bind(this, 'map')}
        />
        <Input type='url' label='Link to Map' value={this.state.map} onChange={this.updateBranding.bind(this, 'map')} disabled={!this.state.preferences.map}/>

        <h2 className="secondaryText largeTopMargin">Conference Package</h2>
		<Switch
          checked={this.state.preferences.package}
          label="Show card with link to download conference package"
          onChange={this.handleChange.bind(this, 'package')}
        />
        <Input type='url' label='Link to Conference Package' value={this.state.package} onChange={this.updateBranding.bind(this, 'package')} disabled={!this.state.preferences.package}/>

        <h2 className="secondaryText largeTopMargin">Important Locations</h2>
		<Switch
          checked={this.state.preferences.location}
          label="Show location card"
          onChange={this.handleChange.bind(this, 'location')}
        />
		<BootstrapTable data={this.state.locations} striped hover insertRow deleteRow selectRow={selectRowProp} cellEdit={cellEditPropLocations} options={optionsLocations} className={this.state.preferences.location ? "" : "disabled"}>
		  <TableHeaderColumn dataField='id' isKey hidden hiddenOnInsert autoValue>Location ID</TableHeaderColumn>
		  <TableHeaderColumn dataField='name' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
			Location
		  </TableHeaderColumn>
		  <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
		</BootstrapTable>

        <h2 className="secondaryText largeTopMargin">Important Contacts</h2>
		<Switch
          checked={this.state.preferences.contact}
          label="Show contacts card"
          onChange={this.handleChange.bind(this, 'contact')}
        />
        <BootstrapTable data={this.state.contacts} striped hover insertRow deleteRow selectRow={selectRowProp} cellEdit={cellEditPropContacts} options={optionsContacts} className={this.state.preferences.contact ? "" : "disabled"}>
          <TableHeaderColumn dataField='id' isKey hidden hiddenOnInsert autoValue>Contact ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
            Contact Name
          </TableHeaderColumn>
          <TableHeaderColumn dataField='phone'>Phone</TableHeaderColumn>
        </BootstrapTable>

        <h2 className="secondaryText largeTopMargin">Text Cards</h2>
		<Switch
          checked={this.state.preferences.content}
          label="Show extra text cards"
          onChange={this.handleChange.bind(this, 'content')}
        />
        <BootstrapTable data={this.state.cards} striped hover insertRow deleteRow selectRow={selectRowProp} cellEdit={cellEditPropCards} options={optionsCards} className={this.state.preferences.content ? "" : "disabled"}>
          <TableHeaderColumn dataField='id' isKey hidden hiddenOnInsert autoValue>Card ID</TableHeaderColumn>
          <TableHeaderColumn dataField='data' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
            Text
          </TableHeaderColumn>
        </BootstrapTable>

        <h2 className="secondaryText largeTopMargin">Sponsors</h2>
        <h3>Note: The same rank *must* be used for each level</h3>
        <h3>For example, all Gold sponsors have rank 0, all Silver sponsors rank 1, and all Bronze rank 2.</h3>
        <BootstrapTable data={this.state.sponsors} striped hover insertRow deleteRow selectRow={selectRowProp} cellEdit={cellEditPropSponsors} options={optionsSponsors}>
          <TableHeaderColumn dataField='id' isKey hidden hiddenOnInsert autoValue>Sponsor ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
            Name
          </TableHeaderColumn>
          <TableHeaderColumn dataField='level' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
            Level
          </TableHeaderColumn>
          <TableHeaderColumn dataField='rank' dataSort filter={ { type: 'NumberFilter', delay: 100, numberComparators: [ '=', '>', '<=' ]  } }>
            Rank
          </TableHeaderColumn>
          <TableHeaderColumn dataField='logo'>Logo</TableHeaderColumn>
          <TableHeaderColumn dataField='website'>Website</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }

}
