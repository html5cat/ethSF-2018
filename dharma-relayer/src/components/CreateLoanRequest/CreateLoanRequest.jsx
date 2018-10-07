// External libraries
import React, { Component } from "react";
import {
    Col,
    ControlLabel,
    Form,
    FormControl,
    FormGroup,
    InputGroup,
    HelpBlock,
} from "react-bootstrap";

import { Dharma } from "@dharmaprotocol/dharma.js";

// Components
import AuthorizableAction from "../AuthorizableAction/AuthorizableAction";
import Loading from "../Loading/Loading";
import TimeUnitSelect from "./TimeUnitSelect/TimeUnitSelect";
import TokenSelect from "./TokenSelect/TokenSelect";
import TransactionManager from "../TransactionManager/TransactionManager";

// Services
import Api from "../../services/api";

// Styling
import "./CreateLoanRequest.css";
import Title from "../Title/Title";
import Error from "../Error/Error";

class CreateLoanRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            principal: 0,
            principalTokenSymbol: "WETH",
            collateral: 0,
            relayerFeeAmount: 0,
            relayerAddress: null,
            collateralTokenSymbol: "REP",
            interestRate: 0,
            termLength: 0,
            termUnit: "weeks",
            // Default the expiration to 30 days.
            expirationLength: 30,
            expirationUnit: "days",
            disabled: false,
            error: null,
            hasSufficientAllowance: null,
            txHash: null,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.createLoanRequest = this.createLoanRequest.bind(this);

        this.setHasSufficientAllowance = this.setHasSufficientAllowance.bind(this);
        this.authorizeCollateralTransfer = this.authorizeCollateralTransfer.bind(this);
    }

    async componentDidMount() {
        this.setHasSufficientAllowance();

        const api = new Api();

        const relayer = await api.get("relayerAddress");

        this.setState({ relayerAddress: relayer.address });
    }

    async getRelayerFee(newPrincipalAmount) {
        const api = new Api();

        return new Promise((resolve) => {
            api.get("relayerFee", { principalAmount: newPrincipalAmount }).then((response) => {
                resolve(response.fee);
            });
        });
    }

    async createLoanRequest() {
        const api = new Api();

        try {
            const { dharma } = this.props;
            const currentAccount = await dharma.blockchain.getCurrentAccount();
            const loanRequest = await this.generateLoanRequest(currentAccount);

            const id = await api.create("loanRequests", {
                ...loanRequest.toJSON(),
                id: loanRequest.getAgreementId(),
            });

            this.props.onCompletion(id);
        } catch (e) {
            console.error(e);
            this.setState({ error: e.message });
        }
    }

    async setHasSufficientAllowance(tokenSymbol) {
        const { dharma } = this.props;

        const { collateralTokenSymbol, collateralAmount } = this.state;

        const symbol = tokenSymbol ? tokenSymbol : collateralTokenSymbol;

        const { Token } = Dharma.Types;

        const currentAccount = await dharma.blockchain.getCurrentAccount();

        const tokenData = await Token.getDataForSymbol(dharma, symbol, currentAccount);

        const hasSufficientAllowance =
            tokenData.hasUnlimitedAllowance || tokenData.allowance >= collateralAmount;

        this.setState({
            hasSufficientAllowance,
        });
    }

    async authorizeCollateralTransfer() {
        const { dharma } = this.props;

        const { Token } = Dharma.Types;

        const { collateralTokenSymbol } = this.state;

        const currentAccount = await dharma.blockchain.getCurrentAccount();

        const txHash = await Token.makeAllowanceUnlimitedIfNecessary(
            dharma,
            collateralTokenSymbol,
            currentAccount,
        );

        this.setState({
            txHash,
        });
    }

    async generateLoanRequest(debtor) {
        const { dharma } = this.props;

        const { LoanRequest } = Dharma.Types;

        const {
            principal,
            principalTokenSymbol,
            collateralTokenSymbol,
            relayerAddress,
            relayerFeeAmount,
            collateral,
            termUnit,
            expirationUnit,
            expirationLength,
            interestRate,
            termLength,
        } = this.state;

        const terms = {
            principalAmount: principal,
            principalToken: principalTokenSymbol,
            collateralAmount: collateral,
            collateralToken: collateralTokenSymbol,
            interestRate,
            relayerFeeAmount,
            relayerAddress,
            termDuration: termLength,
            termUnit,
            expiresInDuration: expirationLength,
            expiresInUnit: expirationUnit,
            // Here we simplistically make the creditor pay the relayer fee.
            creditorFeeAmount: relayerFeeAmount,
        };

        return LoanRequest.createAndSignAsDebtor(dharma, terms, debtor);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (name === "principal") {
            // When the principal changes, the form becomes disabled until the
            // relayer fee has been updated.
            this.setState({ disabled: true });

            this.getRelayerFee(value).then((relayerFeeAmount) => {
                this.setState({
                    relayerFeeAmount,
                    disabled: false,
                });
            });
        }

        this.setState({
            [name]: value,
        });

        if (name === "collateralTokenSymbol") {
            this.setState({
                setHasSufficientAllowance: null,
            });

            this.setHasSufficientAllowance(value);
        }
    }

    render() {
        const { tokens, dharma } = this.props;

        if (tokens.length === 0) {
            return <Loading />;
        }

        const {
            principal,
            principalTokenSymbol,
            collateral,
            relayerFeeAmount,
            collateralTokenSymbol,
            termUnit,
            termLength,
            interestRate,
            expirationUnit,
            expirationLength,
            disabled,
            error,
            hasSufficientAllowance,
            txHash,
        } = this.state;

        const labelWidth = 3;
        const dropdownWidth = 4;
        const inputWidth = 5;

        return (
            <div className="CreateLoanRequest">
                <Title>Create a Loan Request</Title>

                {error && <Error title="Unable to create loan request">{error}</Error>}

                {txHash && (
                    <TransactionManager
                        key={txHash}
                        txHash={txHash}
                        dharma={dharma}
                        description="Authorize Collateral Transfer"
                        onSuccess={this.setHasSufficientAllowance}
                    />
                )}

                <Col md={7}>
                    <Form horizontal disabled={disabled} onSubmit={this.createLoanRequest}>
                        <FormGroup controlId="principal">
                            <Col componentClass={ControlLabel} sm={labelWidth}>
                                Principal
                            </Col>
                            <Col sm={inputWidth}>
                                <FormControl
                                    onChange={this.handleInputChange}
                                    type="number"
                                    placeholder="Principal"
                                    name="principal"
                                    value={principal}
                                />
                            </Col>
                            <Col sm={dropdownWidth}>
                                <TokenSelect
                                    name="principalTokenSymbol"
                                    onChange={this.handleInputChange}
                                    defaultValue={principalTokenSymbol}
                                    tokens={tokens}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="collateral">
                            <Col componentClass={ControlLabel} sm={labelWidth}>
                                Collateral
                            </Col>
                            <Col sm={inputWidth}>
                                <FormControl
                                    onChange={this.handleInputChange}
                                    type="number"
                                    name="collateral"
                                    placeholder="Collateral"
                                    value={collateral}
                                />
                            </Col>
                            <Col sm={dropdownWidth}>
                                <TokenSelect
                                    onChange={this.handleInputChange}
                                    name="collateralTokenSymbol"
                                    defaultValue={collateralTokenSymbol}
                                    tokens={tokens}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="term">
                            <Col componentClass={ControlLabel} sm={labelWidth}>
                                Term Length
                            </Col>
                            <Col sm={inputWidth}>
                                <FormControl
                                    onChange={this.handleInputChange}
                                    type="number"
                                    placeholder="Term Length"
                                    name="termLength"
                                    value={termLength}
                                />
                            </Col>
                            <Col sm={dropdownWidth}>
                                <TimeUnitSelect
                                    onChange={this.handleInputChange}
                                    name="termUnit"
                                    defaultValue={termUnit}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="interest">
                            <Col componentClass={ControlLabel} sm={labelWidth}>
                                Interest Rate
                            </Col>
                            <Col sm={inputWidth}>
                                <InputGroup>
                                    <FormControl
                                        onChange={this.handleInputChange}
                                        type="number"
                                        placeholder="Interest Rate"
                                        name="interestRate"
                                        value={interestRate}
                                    />
                                    <InputGroup.Addon>%</InputGroup.Addon>
                                </InputGroup>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="expiration">
                            <Col componentClass={ControlLabel} sm={labelWidth}>
                                Expiration
                            </Col>
                            <Col sm={inputWidth}>
                                <FormControl
                                    onChange={this.handleInputChange}
                                    type="number"
                                    placeholder="Expiration"
                                    name="expirationLength"
                                    value={expirationLength}
                                />
                            </Col>
                            <Col sm={dropdownWidth}>
                                <TimeUnitSelect
                                    onChange={this.handleInputChange}
                                    name="expirationUnit"
                                    defaultValue={expirationUnit}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="expiration">
                            <Col componentClass={ControlLabel} sm={labelWidth}>
                                Relayer fee
                            </Col>
                            <Col sm={inputWidth}>
                                <InputGroup>
                                    <FormControl
                                        type="number"
                                        placeholder="Relayer fee"
                                        name="relayerFeeAmount"
                                        value={relayerFeeAmount}
                                        readOnly
                                    />
                                    <InputGroup.Addon>{principalTokenSymbol}</InputGroup.Addon>
                                </InputGroup>
                                <HelpBlock>
                                    Relayer fee is deducted from principal amount.
                                </HelpBlock>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col smOffset={labelWidth} sm={10}>
                                <AuthorizableAction
                                    canTakeAction={hasSufficientAllowance}
                                    canAuthorize={
                                        hasSufficientAllowance !== null && !hasSufficientAllowance
                                    }
                                    onAction={this.createLoanRequest}
                                    onAuthorize={this.authorizeCollateralTransfer}
                                >
                                    Create
                                </AuthorizableAction>
                            </Col>
                        </FormGroup>
                    </Form>
                </Col>
            </div>
        );
    }
}

export default CreateLoanRequest;
