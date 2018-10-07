// External libraries
import React, { Component } from "react";

// Components
import LoanRequest from "../components/LoanRequest/LoanRequest";

// Contexts
import DharmaConsumer from "../contexts/Dharma/DharmaConsumer";
import Api from "../services/api";

class LoanRequestContainer extends Component {
    constructor(props) {
        super(props);

        this.onFillComplete = this.onFillComplete.bind(this);
    }

    async onFillComplete(id) {
        const api = new Api();

        await api.delete("loanRequests", id);

        this.props.history.push(`/investments`);
    }

    render() {
        const {id} = this.props.match.params;

        return (
            <DharmaConsumer>
                { (dharmaProps) => {
                    return (
                        <LoanRequest
                            id={ id }
                            dharma={ dharmaProps.dharma }
                            onFillComplete={ async () => {
                                dharmaProps.refreshTokens();
                                await this.onFillComplete(id);
                            } }
                        />
                    )
                } }
            </DharmaConsumer>
        );
    }
}

export default LoanRequestContainer;
