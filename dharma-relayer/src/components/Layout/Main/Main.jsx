// External libraries
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Grid } from "react-bootstrap";

// Containers
import LoanRequestsContainer from "../../../containers/LoanRequests";
import CreateLoanRequestContainer from "../../../containers/CreateLoanRequest";
import TokensContainer from "../../../containers/Tokens";
import LoanRequestContainer from "../../../containers/LoanRequest";

// Styling
import "./Main.css";
import InvestmentsContainer from "../../../containers/Investments";

class Main extends Component {
    render() {
        return (
            <main className="Main">
                <Grid>
                    <Switch>
                        <Route path="/" exact={true} component={LoanRequestsContainer} />
                        <Route path="/create" component={CreateLoanRequestContainer} />
                        <Route path="/tokens" component={TokensContainer} />
                        <Route path="/request/:id" component={LoanRequestContainer} />
                        <Route path="/investments" component={InvestmentsContainer} />
                    </Switch>
                </Grid>
            </main>
        );
    }
}

export default Main;
