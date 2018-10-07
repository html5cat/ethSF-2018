// External libraries
import React from "react";
import { Link } from "react-router-dom";

// Styling
import "./LoanRequestsEmpty.css";

/**
 * Displays when the loan requests table are in the empty state.
 */
class LoanRequestsEmpty extends React.Component {
    render() {
        return (
            <div className="LoanRequestsEmpty">
                <p>There are no loan requests yet. Add one from the <Link to="/create">Create Loan Request</Link> page.</p>
            </div>
        );
    }
}

export default LoanRequestsEmpty;