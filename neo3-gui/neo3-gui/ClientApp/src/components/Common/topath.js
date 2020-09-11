import React from "react";
import "antd/dist/antd.css";
import { Redirect } from "react-router-dom";

class Topath extends React.Component {
  render() {
    if (!this.props.topath) return <div></div>;
    return <Redirect to={this.props.topath} />;
  }
}

export default Topath;
