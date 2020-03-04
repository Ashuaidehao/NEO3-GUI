import { Component } from "react";

class WsMessageComponent extends Component {
    constructor(props) {
        super(props);
        this.hooks=[];
    }



    register(func) {
        let funcWapper=(e)=>{
            var msg = e.detail;
            func(msg);
        };
        this.hooks.push(funcWapper);
        window.addEventListener("wsMessage", funcWapper);
    }

    componentWillUnmount() {
        if(this.hooks.length>0){
            this.hooks.forEach(func => {
                console.log("auto removing:"+func);
                window.removeEventListener("wsMessage", func);
            });    
        }
    }
}

export default WsMessageComponent;