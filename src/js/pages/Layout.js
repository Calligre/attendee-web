import React from "react";
import { Link } from "react-router";

import Footer from "components/layout/Footer";
import Nav from "components/layout/Nav";

export default class Layout extends React.Component {
  render() {
    const { location } = this.props;
    const containerStyle = {
      marginTop: "60px"
    };

    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth //sends auth instance to children
      })
    }

    return (
      <div>

        <Nav location={location} auth={this.props.route.auth}/>

        <div class="container" style={containerStyle}>
          <div class="row">
            <div class="col-lg-12">

              {children}

            </div>
          </div>
          <Footer/>
        </div>
      </div>

    );
  }
}
