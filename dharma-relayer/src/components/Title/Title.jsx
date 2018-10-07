// External libraries
import React from "react";

// Styling
import "./Title.css";

class Title extends React.Component {
    render() {
        const { children } = this.props;

        return <h3 className="Title">{children}</h3>;
    }
}

export default Title;