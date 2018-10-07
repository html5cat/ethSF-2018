// External libraries
import React, { Component } from "react";

// Components
import Investments from "../components/Investments/Investments";

// Contexts
import DharmaConsumer from "../contexts/Dharma/DharmaConsumer";

class InvestmentsContainer extends Component {
    render() {
        return (
            <DharmaConsumer>
                { (dharmaProps) => {
                    return <Investments dharma={ dharmaProps.dharma }/>
                } }
            </DharmaConsumer>
        );
    }
}

export default InvestmentsContainer;
