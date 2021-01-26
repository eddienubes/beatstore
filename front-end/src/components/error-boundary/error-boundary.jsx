import React, {Component} from "react";
import ErrorIndicator from "../error-indicator";

export default class ErrorBoundary extends Component {
    state = {
        hasError: false
    };

    constructor(props) {
        super(props);
    }

    componentDidCatch(error, errorInfo) {
        this.setState(({hasError}) => {
            return {hasError: !hasError};
        });

        console.log(error, errorInfo)
    };

    render() {
        if (this.state.hasError)
            return <ErrorIndicator/>;

        return this.props.children;
    };
};
