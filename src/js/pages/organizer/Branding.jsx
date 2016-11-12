import React from "react";

export default class Branding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	name: '',
    	organization: '',
    	dateStart: '',
    	dateEnd: '',
    	colourPrimary: '',
    	colourSecondary: '',
    	logo: '',
    	logoSquare: '',
    	icon: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({name: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
  }

  render() {
  	debugger
    return (
      <form onSubmit={this.handleSubmit}>
        Name: <input type="text" value={this.state.name} onChange={this.handleChange} />
        Organization: <input type="text" value={this.state.organization} onChange={this.handleChange} />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}