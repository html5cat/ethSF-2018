import React, { Component } from "react";

import DharmaContext from "./DharmaContext";

class DharmaConsumer extends Component {
    render() {
        return <DharmaContext.Consumer {...this.props} />;
    }
}

export default DharmaConsumer;
