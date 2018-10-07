import React, { Component } from "react";
import { Button } from "react-bootstrap";

// Styling
import "./AuthorizableAction.css";

class AuthorizableAction extends Component {
    handleClick(event, callback) {
        event.preventDefault();

        callback();
    }

    render() {
        const { canTakeAction, canAuthorize, onAction, onAuthorize } = this.props;

        return (
            <div className="Actions">
                <Button
                    onClick={(event) => this.handleClick(event, onAuthorize)}
                    disabled={!canAuthorize}
                    bsStyle="primary"
                    className="AuthorizableAction-Authorize">
                    Authorize Token Transfer
                </Button>

                <Button
                    onClick={(event) => this.handleClick(event, onAction)}
                    disabled={!canTakeAction}
                    bsStyle="primary"
                    className="AuthorizableAction-Action">
                    {this.props.children}
                </Button>
            </div>
        );
    }
}

export default AuthorizableAction;
