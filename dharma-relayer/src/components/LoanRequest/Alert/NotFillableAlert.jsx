import React, { Component } from "react";
import { Alert } from "react-bootstrap";

import "./NotFillableAlert.css";

class NotFillableAlert extends Component {
    render() {
        const { children } = this.props;

        // NOTE: We'll make a hack here for dealing with whether the error is just because
        // the user hasn't allowed transfer for the principal token yet. But in future versions
        // we can be more sophisticated about it.

        if (children === "Creditor allowance is insufficient") {
            return (
                <Alert className="NotFillableAlert" bsStyle="info">
                    <h4 className="NotFillableAlert-Title">Steps Required</h4>
                    <p>Token transfer authorization required. Click "Authorize Token Transfer".</p>
                </Alert>
            );
        }

        return (
            <Alert className="NotFillableAlert" bsStyle="danger">
                <h4 className="NotFillableAlert-Title">This loan request cannot be filled</h4>
                <p>{this.props.children}</p>
            </Alert>
        );
    }
}

export default NotFillableAlert;
