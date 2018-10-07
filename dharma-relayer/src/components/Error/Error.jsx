import React, { Component } from "react";
import { Alert } from "react-bootstrap";

import "./Error.css";

class Error extends Component {
    render() {
        const { children, title } = this.props;

        return (
            <Alert className="Error" bsStyle="danger">
                { title && <h4 className="Error-Title">{title}</h4> }

                <p>{children}</p>
            </Alert>
        );
    }
}

export default Error;
