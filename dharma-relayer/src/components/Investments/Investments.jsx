// External libraries
import { Dharma } from "@dharmaprotocol/dharma.js";
import React from "react";
import BootstrapTable from "react-bootstrap-table-next";

// Styling
import "./Investments.css";
import Title from "../Title/Title";
import Loading from "../Loading/Loading";

const columns = [
    {
        dataField: "principal",
        text: "Principal",
    },
    {
        dataField: "interestRate",
        text: "Interest Rate",
    },
    {
        dataField: "term",
        text: "Term Length",
    },
    {
        dataField: "collateral",
        text: "Collateral",
    },
    {
        dataField: "repaidAmount",
        text: "Repaid",
    },
    {
        dataField: "totalExpectedRepaymentAmount",
        text: "Total Expected Repayment",
    },
];

class Investments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            investments: null,
        };

        this.getData = this.getData.bind(this);
    }

    async componentDidMount() {
        const { dharma } = this.props;

        const { Investments } = Dharma.Types;

        const creditor = await dharma.blockchain.getCurrentAccount();

        const investments = await Investments.getExpandedData(dharma, creditor);

        this.setState({
            investments,
        });
    }

    getData() {
        const { investments } = this.state;

        if (!investments) {
            return null;
        }

        return investments.map((investment) => {
            return {
                ...investment,
                principal: `${investment.principalAmount} ${investment.principalTokenSymbol}`,
                collateral: `${investment.collateralAmount} ${investment.collateralTokenSymbol}`,
                term: `${investment.termDuration} ${investment.termUnit}`,
                repaidAmount: `${investment.repaidAmount} ${investment.principalTokenSymbol}`,
                totalExpectedRepaymentAmount: `${investment.totalExpectedRepaymentAmount} ${
                    investment.principalTokenSymbol
                }`,
            };
        });
    }

    render() {
        const data = this.getData();

        if (!data) {
            return <Loading />;
        }

        return (
            <div className="Investments">
                <Title>Your Investments</Title>

                {
                    data
                        ? <BootstrapTable keyField="id" columns={columns} data={data} />
                        : <Loading/>
                }
            </div>
        );
    }
}

export default Investments;
