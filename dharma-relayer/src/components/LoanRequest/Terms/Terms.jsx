import React, { Component } from "react";
import * as moment from "moment";

class Terms extends Component {
    render() {
        const { terms } = this.props;

        return (
            <div>
                <dl className="row">
                    <dt className="col-sm-3">Principal</dt>
                    <dd className="col-sm-9">
                        {`${terms.principalAmount} ${terms.principalTokenSymbol}`}
                    </dd>

                    <dt className="col-sm-3">Collateral</dt>
                    <dd className="col-sm-9">
                        {`${terms.collateralAmount} ${terms.collateralTokenSymbol}`}
                    </dd>

                    <dt className="col-sm-3">Interest Rate</dt>
                    <dd className="col-sm-9">{terms.interestRate}%</dd>

                    <dt className="col-sm-3">Term Duration</dt>
                    <dd className="col-sm-9">{`${terms.termDuration} ${terms.termUnit}`}</dd>

                    <dt className="col-sm-3">Loan Requester</dt>
                    <dd className="col-sm-9">
                        <a
                            href={`https://etherscan.io/address/${terms.debtorAddress}`}
                            target="_blank">
                            {terms.debtorAddress}
                        </a>
                    </dd>
                    <dt className="col-sm-3">Expiration Date</dt>
                    <dd className="col-sm-9">
                        {moment.unix(terms.expiresAt).format("MMMM Do YYYY, h:mm:ss a")}
                    </dd>
                </dl>
            </div>
        );
    }
}

export default Terms;
