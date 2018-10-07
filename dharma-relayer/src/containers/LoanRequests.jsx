// External libraries
import React, { Component } from "react";

// Components
import LoanRequests from "../components/LoanRequests/LoanRequests";

// Contexts
import DharmaConsumer from "../contexts/Dharma/DharmaConsumer";

class LoanRequestsContainer extends Component {
    constructor(props) {
        super(props);

        this.redirect = this.redirect.bind(this);
        this.parseQueryParams = this.parseQueryParams.bind(this);
    }

    redirect(location) {
        this.props.history.push(location);
    }

    /**
     * Returns the id of the LoanRequest that should be highlighted.
     *
     * @returns {number||null}
     */
    parseQueryParams() {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const rowToHighlight = params.get("highlightRow");

        if (rowToHighlight) {
            return parseInt(rowToHighlight, 10);
        } else {
            return null;
        }
    }

    render() {
        const highlightRow = this.parseQueryParams();

        return (
            <DharmaConsumer>
                {(dharmaProps) => (
                    <LoanRequests
                        dharma={dharmaProps.dharma}
                        redirect={this.redirect}
                        highlightRow={highlightRow}
                    />
                )}
            </DharmaConsumer>
        );
    }
}

export default LoanRequestsContainer;
