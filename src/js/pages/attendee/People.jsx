import React from 'react';
import { IndexLink } from 'react-router';
import PeopleStore from 'stores/PeopleStore';
import SearchInput, { createFilter } from 'react-search-input';
import Select from 'react-select';
import SwapVert from 'react-icons/lib/md/swap-vert';

export default class People extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      people: [],
      searchTerm: '',
      filterTerms: '',
      sortKey: 'first_name',
      sortDirection: 1,
      sortOptions: [
        {
          value: 'first_name',
          label: 'First name',
        },
        {
          value: 'last_name',
          label: 'Last name',
        },
        {
          value: 'rank',
          label: 'Rank',
        },
      ],
    };
    PeopleStore.getAll();
  }

  componentWillMount() {
    PeopleStore.on('received', this.getPeople);
    PeopleStore.on('updated', this.getPeople);
    PeopleStore.on('error', this.showError);
  }

  componentWillUnmount() {
    PeopleStore.removeListener('received', this.getPeople);
    PeopleStore.removeListener('updated', this.getPeople);
    PeopleStore.removeListener('error', this.showError);
  }

  getPeople = () => {
    this.setState({
      people: PeopleStore.people,
    });
  }

  showError = () => {
    console.log(PeopleStore.error);
  }

  searchUpdated = (term) => {
    this.setState({
      searchTerm: term,
    });
  }

  filterUpdated = (terms) => {
    this.setState({
      filterTerms: terms,
    });
  }

  sortKeyUpdated = (key) => {
    this.setState({
      sortKey: key,
    });
  }

  sortDirectionUpdated = () => {
    this.setState({
      sortDirection: -this.state.sortDirection,
    });
  }

  render() {
    const { people, sortKey, sortDirection, searchTerm } = this.state;
    const self = this;

    people.sort((a, b) => {
      if (typeof a[sortKey] === 'string') {
        return (a[sortKey].localeCompare(b[sortKey])) * sortDirection;
      }

      return (a[sortKey] - b[sortKey]) * sortDirection;
    });

    // Filter based on the multi-select organization field. Match all selected.
    const filteredPeople = people.filter(person => self.state.filterTerms.length === 0 ||
             (self.state.filterTerms.indexOf(person.organization) >= 0 &&
             person.organization !== ''));

    // Filter based on search input. Match only on all search terms separated by spaces
    const KEYS = ['first_name', 'last_name', 'organization'];
    const selectedPeople = filteredPeople.filter(createFilter(searchTerm, KEYS));

    // Create a list of organizations for the multiselect
    const organizations = people.map(person => ({
      value: person.organization,
      label: person.organization,
    })).filter((value, index, self) => (self.indexOf(value) === index) && value.value !== '');

    const buttonIcon = React.createElement(SwapVert, null);

    return (
      <div>
        <h1 className="primaryText">People</h1>
        <SearchInput className="searchBar Select-control search-input" onChange={this.searchUpdated} placeholder="Search for someone" />
        <Select multi simpleValue className="searchBar" value={this.state.filterTerms} placeholder="Filter by organization:" options={organizations} onChange={this.filterUpdated} />
        <div className="sortContainer searchBar">
          <button className="secondaryBackground directionButton" onClick={this.sortDirectionUpdated}>
            {buttonIcon}
          </button>
          <Select className="sortComponent" simpleValue clearable={false} value={this.state.sortKey} options={this.state.sortOptions} onChange={this.sortKeyUpdated} />
        </div>
        <PeopleList data={selectedPeople} />
      </div>
    );
  }
}

const PeopleList = React.createClass({
  render() {
    const peopleNodes = this.props.data.map((person) => {
      if (person.private) {
        return null;
      }
      return (
        <Person name={`${person.first_name} ${person.last_name}`} photo={person.photo} points={person.points} organization={person.organization} profileID={person.id} key={person.id.toString()} rank={person.rank.toString()} />
      );
    });
    return (
      <div className="peopleList">
        {peopleNodes}
      </div>
    );
  },
});

const Person = React.createClass({
  render() {
    return (
      <div className="person">
        <IndexLink to={{ pathname: `people/${this.props.profileID}` }}>
          <div className="points-container">
            <div className="top-half">
              <p className="personPoints"> {this.props.points} </p>
            </div>
            <div className="bottom-half">
              <p className="personRank"> Rank: {this.props.rank} </p>
            </div>
          </div>
          <img src={this.props.photo} />
          <div className="info-container">
            <div className="top-half">
              <p className="personName"> {this.props.name} </p>
            </div>
            <div className="bottom-half">
              <p className="personOrg"> {this.props.organization} </p>
            </div>
          </div>
        </IndexLink>
      </div>
    );
  },
});
