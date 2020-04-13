import React from 'react';
import { Alert, Layout } from 'antd';


class Advanced extends React.Component {
    state = {
        loading: true,
    };
    render() {
        return (
            <Layout className="gui-container">
                <div>
                    <Alert
                    message="Informational Notes"
                    description="Additional description and information about copywriting."
                    type="info"
                    closable
                    showIcon
                    />
                </div>
            </Layout>
        );
    }
}
    

export default Advanced;