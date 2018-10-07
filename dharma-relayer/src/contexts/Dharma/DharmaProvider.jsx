import React, { Component } from "react";
import { Dharma, Web3 } from "@dharmaprotocol/dharma.js";

import DharmaContext from "./DharmaContext";

// Get the host from the current environment. If it is not specified, we will assume we
// are running a testnet or production build and use Metamask.
const HOST = process.env.REACT_APP_BLOCKCHAIN_HOST;

/**
 * This method returns a Web3 provider, which is passed to Dharma.js and used to communicate with an
 * Ethereum blockchain node.
 *
 * For local development purposes, the blockchain node is usually a localhost URL such as
 * localhost:8545. In this case the function should return Web3's HTTP Provider, configured to
 * use localhost:8545. Depending on the deployment context, there may also be a provider on an
 * injected web3 instance (for example when using MetaMask in a browser), in which case that
 * provider is returned.
 *
 * @returns {Web3.Provider}
 */
function getWeb3Provider() {
    if (HOST) {
        return new Web3.providers.HttpProvider(HOST);
    } else if (window.web3) {
        return window.web3.currentProvider;
    } else {
        throw new Error("No web3 provider reachable.");
    }
}

const dharma = new Dharma(getWeb3Provider());

/**
 * Allows any children of this provider to have access to an instance of Dharma.js that is
 * connected to a blockchain.
 */
class DharmaProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // The tokens that the user has in their wallet.
            tokens: [],
            dharma: null,
            // The tokens available for lending on Dharma Protocol.
            supportedTokens: [],
        };

        this.getUserTokens = this.getUserTokens.bind(this);
    }

    componentDidMount() {
        this.getUserTokens();
        this.getSupportedTokens();
    }

    getSupportedTokens() {
        dharma.token.getSupportedTokens().then((supportedTokens) => {
            this.setState({ supportedTokens });
        });
    }

    getUserTokens() {
        const { Token } = Dharma.Types;

        // Assume the tokens are out of date.
        this.setState({
            tokens: [],
        });

        dharma.blockchain.getAccounts().then((accounts) => {
            const owner = accounts[0];

            Token.all(dharma, owner).then((tokenData) => {
                this.setState({
                    tokens: tokenData,
                });
            });
        });
    }

    render() {
        const dharmaProps = {
            dharma: dharma,
            tokens: this.state.tokens,
            supportedTokens: this.state.supportedTokens,
            refreshTokens: this.getUserTokens,
        };

        return (
            <DharmaContext.Provider value={dharmaProps}>
                {this.props.children}
            </DharmaContext.Provider>
        );
    }
}

export default DharmaProvider;
