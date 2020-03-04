import React from 'react';
import { Icon } from 'antd';

class InTitle extends React.Component{
    constructor (props){
        super(props);
        this.state = {};
    }
    render(){
        return (
            <div>
                <div className="in-title">
                    <h2 className="mb0">
                        {this.props.content}
                        {this.props.show?(
                            <Icon className="float-r small" type="plus-circle" onClick={this.props.openProps}></Icon>
                        ):null}
                    </h2>
                </div>
            </div>
        )
    }
} 

export default InTitle;