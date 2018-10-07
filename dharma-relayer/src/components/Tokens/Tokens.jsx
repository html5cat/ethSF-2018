// External libraries
import React, { Component } from "react";
import { Table } from "react-bootstrap";

// Components
import Loading from "../Loading/Loading";
import Title from "../Title/Title";

class Tokens extends Component {
    render() {
        const { tokens } = this.props;

        if (tokens.length === 0) {
            return <Loading/>;
        }

        return (
            <div className="Tokens">
                <Title>Your Tokens</Title>
                <Table striped bordered condensed hover responsive>
                    <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Balance</th>
                        <th>Allowance</th>
                    </tr>
                    </thead>

                    <tbody>
                    {tokens.map((token) => {
                        return (
                            <tr key={token.symbol}>
                                <td>{token.symbol}</td>
                                <td>{token.balance}</td>
                                <td>
                                    {token.hasUnlimitedAllowance ? "Unlimited" : token.allowance}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Tokens;