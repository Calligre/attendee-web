import React from "react";
import { Link } from "react-router";

import Footer from "components/layout/Footer";
import Nav from "components/layout/attendee/Nav";

export default class Layout extends React.Component {
  render() {
    const { location } = this.props;

    return (
      <div>
        <Nav location={location} auth={this.props.route.auth}/>
        <div class="container navHeader">
          <div class="row">
            <div class="col-lg-12">
              {this.props.children}
            </div>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}
