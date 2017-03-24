import React from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import BrandStore from "stores/BrandStore";
import PreferenceStore from 'stores/PreferenceStore';

export default class Cards extends React.Component {

  constructor() {
    super();
    this.state = {
      cards: [],
      locations: [],
      contacts: [],
      sponsors: [],
      preferences: PreferenceStore.getDefaults(),
    };

    BrandStore.getAll();
    PreferenceStore.loadAll();
  }

  componentWillMount() {
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
    PreferenceStore.on('loaded', this.loadPreferences);
    PreferenceStore.on('error', this.showError);
    BrandStore.on("error", this.showError);
  }

  componentWillUnmount() {
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
    PreferenceStore.removeListener('loaded', this.loadPreferences);
    PreferenceStore.removeListener('error', this.showError);
    BrandStore.removeListener("error", this.showError);
  }

  showError = () => {
    console.log(BrandStore.error);
    console.log(PreferenceStore.error);
  }

  loadPreferences = () => {
    this.setState({ preferences: PreferenceStore.preferences });
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
    var updatedLocation = {
      id: -1,
      level: "",
      logo: "",
      name: "",
      website: "",
    }
    for (const prop in row) {
      updatedLocation[prop] = row[prop];
    }
    return updatedLocation;
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
        <h1 className="primaryText largeTopMargin">Important Locations</h1>
        { preferences.location ?
          <BootstrapTable data={this.state.locations} striped hover insertRow deleteRow selectRow={selectRowProp} cellEdit={cellEditPropLocations} options={optionsLocations}>
            <TableHeaderColumn dataField='id' isKey hidden hiddenOnInsert autoValue>Location ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
              Location
            </TableHeaderColumn>
            <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
          </BootstrapTable>
        : <div className="disabled-placeholder">Locations card has been disabled, check your preferences</div>
        }
        <h1 className="primaryText largeTopMargin">Important Contacts</h1>
        { preferences.contact ?
          <BootstrapTable data={this.state.contacts} striped hover insertRow deleteRow selectRow={selectRowProp} cellEdit={cellEditPropContacts} options={optionsContacts}>
            <TableHeaderColumn dataField='id' isKey hidden hiddenOnInsert autoValue>Contact ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
              Contact Name
            </TableHeaderColumn>
            <TableHeaderColumn dataField='phone'>Phone</TableHeaderColumn>
          </BootstrapTable>
          : <div className="disabled-placeholder">Contacts card has been disabled, check your preferences</div>
        }

        <h1 className="primaryText largeTopMargin">Text Cards</h1>
        { preferences.content ?
          <BootstrapTable data={this.state.cards} striped hover insertRow deleteRow selectRow={selectRowProp} cellEdit={cellEditPropCards} options={optionsCards}>
            <TableHeaderColumn dataField='id' isKey hidden hiddenOnInsert autoValue>Card ID</TableHeaderColumn>
            <TableHeaderColumn dataField='data' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
              Text
            </TableHeaderColumn>
          </BootstrapTable>
          : <div className="disabled-placeholder">Content card has been disabled, check your preferences</div>
        }

        <h1 className="primaryText largeTopMargin">Sponsors</h1>
        <BootstrapTable data={this.state.sponsors} striped hover insertRow deleteRow selectRow={selectRowProp} cellEdit={cellEditPropSponsors} options={optionsSponsors}>
          <TableHeaderColumn dataField='id' isKey hidden hiddenOnInsert autoValue>Sponsor ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
            Name
          </TableHeaderColumn>
          <TableHeaderColumn dataField='level' dataSort filter={ { type: 'TextFilter', delay: 100 } }>
            Level
          </TableHeaderColumn>
          <TableHeaderColumn dataField='logo'>Logo</TableHeaderColumn>
          <TableHeaderColumn dataField='website'>Website</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }

}