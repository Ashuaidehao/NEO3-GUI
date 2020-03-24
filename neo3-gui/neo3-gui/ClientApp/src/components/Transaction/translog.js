import React from 'react';
import '../../static/css/trans.css';
import { Divider } from 'antd';

class Translog extends React.Component{
  render = () =>{
    const {notifies} = this.props;
    return (
    <div className="info-detail">
      <ul className="trans-ul">
      {notifies.map((item)=>{
        let _data = item.state?item.state.value:[];
        var html=[];
        html.push(<li className="trans-title pa3" key="title"><span>ScriptHash: &nbsp;&nbsp;&nbsp;</span>{item.contract}</li>);
        for(var i = 0;i<_data.length;i++){
          html.push(<li className="pa3" key={i}><span className="trans-type">{_data[i].type}</span>{_data[i].value? JSON.stringify(_data[i].value).replace(/"/g,' '):"--"}</li>);
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