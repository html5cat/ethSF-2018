// External libraries
import { Dharma } from "@dharmaprotocol/dharma.js";
import * as moment from "moment";
import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";

// Components
import Loading from "../Loading/Loading";

// Services
import Api from "../../services/api";

// Styling
import "./LoanRequests.css";
import Title from "../Title/Title";
import LoanRequestsEmpty from "./LoanRequestsEmpty/LoanRequestsEmpty";

/**
 * Here we define the columns that appear in the table that holds all of the
 * open Loan Requests.
 */
const columns = [
    {
        dataField: "principal",
        text: "Principal",
    },
    {
        dataField: "collateral",
        text: "Collateral",
    },
    {
        dataField: "interestRate",
        text: "Interest Rate",
    },
    {
        dataField: "termDuration",
        text: "Term Length",
    },
    {
        dataField: "expiration",
        text: "Expiration",
    },
    {
        dataField: "requestedAt",
        text: "Requested at",
    },
];

class LoanRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loanRequests: [],
            highlightRow: null,
            isLoading: true,
        };

        this.parseLoanRequests = this.parseLoanRequests.bind(this);
        this.parseLoanRequest = this.parseLoanRequest.bind(this);
    }

    /**
     * When the component mounts, use the API to get all of the load requests from the relayer
     * database, and parse those into LoanRequest objects using Dharma.js. Then, set the state of
     * the current component to include those loan requests so that they can be rendered as a table.
     *
     * This function assumes that there is a database with Loan Request data, and that we have
     * access to Dharma.js, which is connected to a blockchain.
     */
    componentDidMount() {
        const { highlightRow } = this.props;

        this.setState({
            highlightRow,
        });

        const api = new Api();

        const sort = "createdAt";
        const order = "desc";

        api.get("loanRequests", { sort, order })
            .then(this.parseLoanRequests)
            .then((loanRequests) => this.setState({ loanRequests, isLoading: false }))
            .catch((error) => console.error(error));
    }

    parseLoanRequests(loanRequestData) {
        return Promise.all(loanRequestData.map(this.parseLoanRequest));
    }

    /**
     * Given loan data that comes from the relayer database, `parseLoanRequest` uses Dharma.js to
     * instantiate a `LoanRequest` type, which has access to more information about the loan. It
     * then adds an id and requestedAt (both from the relayer database) to that object.
     *
     * @param datum
     * @returns {Promise<any>}
     */
    parseLoanRequest(datum) {
        const { dharma } = this.props;

        const { LoanRequest } = Dharma.Types;

        return new Promise((resolve) => {
            LoanRequest.load(dharma, datum).then((loanRequest) => {
                resolve({
                    ...loanRequest.getTerms(),
                    id: datum.id,
                    requestedAt: datum.createdAt,
                });
            });
        });
    }

    /**
     * Returns an array of loan requests, which can be rendered in a table.
     *
     * For each `LoanRequest` object from Dharma.js, it adds two human-readable timestamps - one
     * describing when the request was created, and one describing its expiration date.
     */
    getData() {
        const { loanRequests } = this.state;

        return loanRequests.map((request) => {
            return {
                ...request,
                principal: `${request.principalAmount} ${request.principalTokenSymbol}`,
                collateral: `${request.collateralAmount} ${request.collateralTokenSymbol}`,
                interestRate: `${request.interestRate}%`,
                termDuration: `${request.termDuration} ${request.termUnit}`,
                expiration: moment.unix(request.expiresAt).fromNow(),
                requestedAt: moment(request.requestedAt).calendar(),
            };
        });
    }

    render() {
        const { highlightRow, isLoading } = this.state;

        const data = this.getData();

        if (isLoading) {
            return <Loading/>;
        }

        const rowEvents = {
            onClick: (e, row, rowIndex) => {
                this.props.redirect(`/request/${row.id}`);
            },
        };

        const rowClasses = (row, rowIndex) => {
            const rowData = data[rowIndex];

            if (rowData.id === highlightRow) {
                return "loan-request-row highlight";
            } else {
                return "loan-request-row";
            }
        };

        return (
            <div className="LoanRequests">
                <Title>Browse Loan Requests</Title>

                <BootstrapTable
                    hover={true}
                    keyField="id"
                    columns={columns}
                    data={data}
                    rowEvents={rowEvents}
                    rowClasses={rowClasses}
                />

                {
                    data.length === 0 && <LoanRequestsEmpty/>
                }
            </div>
        );
    }
}

export default LoanRequests;
