import React from 'react';
import '../../static/css/trans.css';
import { Divider } from 'antd';

class Translog extends React.Component{
  constructor(props){
    super(props);
  }
  render = () =>{
    const {notifies,hash} = this.props;
    return (
    <div className="info-detail">
        <p className="pv3"></p>
        <ul className="trans-ul">
        {notifies.map((item,index)=>{
            let _data = item.value;
            var html=[];
            html.push(<li className="trans-title pa3" key="title"><span>ScriptHash: &nbsp;&nbsp;&nbsp;</span>{hash}</li>);
            for(var i = 0;i<_data.length;i++){
                html.push(<li className="pa3" key={i}><span className="trans-type">{_data[i].type}</span>{_data[i].value?_data[i].value:"--"}</li>)
            }
            html.push(<Divider key="divider"></Divider>)
            return html;
        })}   
        </ul>
    </div>
    );
  }
} 

export default Translog;