import React, { Component } from "react";
import { FormControl } from "react-bootstrap";

class TokenSelect extends Component {
    render() {
        const { name, onChange, defaultValue, tokens } = this.props;

        return (
            <FormControl
                name={name}
                onChange={onChange}
                componentClass="select"
                placeholder="select"
                defaultValue={defaultValue}>
                {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                        {`${token.symbol} (${token.name})`}
                    </option>
                ))}
            </FormControl>
        );
    }
}

export default TokenSelect;
