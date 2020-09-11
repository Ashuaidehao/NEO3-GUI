import React from "react";
import { PlusCircleOutlined } from "@ant-design/icons";

class InTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="in-title">
          <h2 className="mb0">
            {this.props.content}
            {this.props.show ? (
              <div className="wal-import float-r">
                <PlusCircleOutlined className="" />
                <ul className="wal-ul mt4">
                  <li>
                    <a onClick={this.addAddress}>创建新地址</a>
                  </li>
                  <li>
                    <a>导入私钥</a>
                  </li>
                </ul>
              </div>
            ) : null}
          </h2>
        </div>
      </div>
    );
  }
}

export default InTitle;
