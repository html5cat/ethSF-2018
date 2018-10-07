import { Dharma } from "@dharmaprotocol/dharma.js";
import React, { Component } from "react";

import Api from "../../services/api";

import AuthorizableAction from "../AuthorizableAction/AuthorizableAction";
import Terms from "./Terms/Terms";
import NotFillableAlert from "./Alert/NotFillableAlert";

import TransactionManager from "../TransactionManager/TransactionManager";
import Loading from "../Loading/Loading";

import "./LoanRequest.css";

import { LinkContainer } from "react-router-bootstrap";

import { Breadcrumb, Panel } from "react-bootstrap";

const TRANSACTION_DESCRIPTIONS = {
    fill: "Loan Request Fill",
    allowance: "Authorize Loan Request",
};

class LoanRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loanRequest: null,
            hasSufficientAllowance: null,
            transactions: [],
            error: null,
        };

        // handlers
        this.handleFill = this.handleFill.bind(this);
        this.handleAuthorize = this.handleAuthorize.bind(this);

        // setters
        this.reloadState = this.reloadState.bind(this);
        this.setHasSufficientAllowance = this.setHasSufficientAllowance.bind(this);
        this.assertFillable = this.assertFillable.bind(this);
    }

    componentDidMount() {
        const { LoanRequest } = Dharma.Types;

        const { dharma, id } = this.props;

        const api = new Api();

        api.get(`loanRequests/${id}`).then(async (loanRequestData) => {
            const loanRequest = await LoanRequest.load(dharma, loanRequestData);
            this.setState({ loanRequest });
            this.reloadState();
        });
    }

    reloadState() {
        this.setHasSufficientAllowance();
        this.assertFillable();
    }

    async handleFill() {
        const { loanRequest } = this.state;

        loanRequest
            .fillAsCreditor()
            .then((txHash) => {
                const { transactions } = this.state;
                transactions.push({ txHash, description: TRANSACTION_DESCRIPTIONS.fill });

                this.setState({
                    transactions,
                });
            })
            .catch((error) => {
                this.setState({
                    error,
                });
            });
    }

    async handleAuthorize() {
        const { loanRequest, transactions } = this.state;

        const { dharma } = this.props;

        const { Token } = Dharma.Types;

        const owner = await dharma.blockchain.getCurrentAccount();

        const terms = loanRequest.getTerms();

        const txHash = await Token.makeAllowanceUnlimitedIfNecessary(dharma, terms.principalTokenSymbol, owner);

        if (txHash) {
            transactions.push({ txHash, description: TRANSACTION_DESCRIPTIONS.allowance });

            this.setState({
                transactions,
            });
        }
    }

    async assertFillable() {
        const { loanRequest } = this.state;

        loanRequest
            .assertFillable()
            .then(() => {
                this.setState({
                    error: null,
                });
            })
            .catch((error) => {
                this.setState({
                    error,
                });
            });
    }

    async setHasSufficientAllowance() {
        const { dharma } = this.props;
        const { loanRequest } = this.state;

        const { Token } = Dharma.Types;

        const currentAccount = await dharma.blockchain.getCurrentAccount();

        const terms = loanRequest.getTerms();

        const tokenData = await Token.getDataForSymbol(dharma, terms.principalTokenSymbol, currentAccount);

        const hasSufficientAllowance =
            tokenData.hasUnlimitedAllowance || tokenData.allowance >= terms.principalAmount;

        this.setState({
            hasSufficientAllowance,
        });
    }

    render() {
        const { loanRequest, hasSufficientAllowance, transactions, error } = this.state;

        const { dharma, onFillComplete } = this.props;

        if (!loanRequest || hasSufficientAllowance === null) {
            return <Loading />;
        }

        return (
            <div>
                <Breadcrumb>
                    <LinkContainer to="/" exact={true}>
                        <Breadcrumb.Item href="#">&lsaquo; All Requests</Breadcrumb.Item>
                    </LinkContainer>

                    <Breadcrumb.Item active>Details</Breadcrumb.Item>
                </Breadcrumb>

                {error && <NotFillableAlert>{error.message}</NotFillableAlert>}

                {transactions.map((transaction) => {
                    const { txHash, description } = transaction;

                    let onSuccess;

                    if (description === TRANSACTION_DESCRIPTIONS.fill) {
                        onSuccess = onFillComplete;
                    } else {
                        onSuccess = this.reloadState;
                    }

                    return (
                        <TransactionManager
                            key={txHash}
                            txHash={txHash}
                            dharma={dharma}
                            description={description}
                            onSuccess={onSuccess}
                        />
                    );
                })}

                <Panel bsStyle="primary">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Loan Request</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <Terms terms={loanRequest.getTerms()} />
                    </Panel.Body>
                    <Panel.Footer>
                        <AuthorizableAction
                            canTakeAction={!error && hasSufficientAllowance}
                            canAuthorize={!hasSufficientAllowance}
                            onAction={this.handleFill}
                            onAuthorize={this.handleAuthorize}>
                            Fill
                        </AuthorizableAction>
                    </Panel.Footer>
                </Panel>
            </div>
        );
    }
}

export default LoanRequest;
