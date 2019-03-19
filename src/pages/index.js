import React from "react";
import { connect } from "dva";
import { Button } from "antd";
import { request } from "../utils/request";

class Index extends React.Component {
  constructor(props) {
    super(props);
  }
  buttonClick() {
    request({ method: "get", url: "district" }).then(res => {
      console.log(res);
    });
  }
  render() {
    return (
      <div>
        <Button onClick={this.buttonClick}>OK</Button>
      </div>
    );
  }
}
export default connect()(Index);
