import React from 'react';
import {
    PlusCircleOutlined
} from '@ant-design/icons';

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
                            <PlusCircleOutlined className="float-r small" onClick={this.props.openProps}/>
                        ):null}
                    </h2>
                </div>
            </div>
        )
    }
} 

export default InTitle;