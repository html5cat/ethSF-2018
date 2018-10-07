import { Web3Wrapper } from '@0xproject/web3-wrapper';
// import {RequestQRCode, RequestData} from '@bloomprotocol/share-kit';
import { Dharma } from '@dharmaprotocol/dharma.js';
// import Maker from '@makerdao/dai';
import { Button, Content, Control, Subtitle } from 'bloomer';
import * as React from 'react';

interface Props {
    web3Wrapper: Web3Wrapper;
}

// const MyComponent: React.SFC = props => {
//     const requestData: RequestData = {
//         action: 'request_attestation_data',
//         token: '0x8f31e48a585fd12ba58e70e03292cac712cbae39bc7eb980ec189aa88e24d043',
//         url: 'https://bloom.co/api/receiveData',
//         org_logo_url: 'https://bloom.co/images/notif/bloom-logo.png',
//         org_name: 'Bloom',
//         org_usage_policy_url: 'https://bloom.co/legal/terms',
//         org_privacy_policy_url: 'https://bloom.co/legal/privacy',
//         types: ['phone', 'email'],
//       };
//     return <RequestQRCode requestData={requestData} size={200} />;
// };

// const maker = Maker.create('browser');

// async function openLockDraw() {
//   await maker.authenticate();
//   const cdp = await maker.openCdp();

//   await cdp.lockEth(0.25);
//   await cdp.drawDai(50);

//   const debt = await cdp.getDebtValue();
//   console.log(debt.toString); // '50.00 DAI'
// }

// openLockDraw();

export class Faucet extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    public render(): React.ReactNode {
        return (
            <Content style={{ marginTop: '20px' }}>
                <Subtitle isSize={6}>Login with BloomID</Subtitle>
                <img src={'/sampleQR.png'} />
                <p>
                    {' '}
                    {/* Faucets will dispense ETH and ZRX tokens to your account on the test network. This will allow you to
                    begin exchanging ERC20 tokens. */}
                </p>
                <Subtitle isSize={6}>Create a Student Loan</Subtitle>
                <Control>
                    <Button isSize="small" id="dharma" onClick={this.dharma} isColor="primary">
                        Create a Dharma loan
                    </Button>

                    {/* <Button isSize="small" id="dispenseETH" onClick={this.dispenseETH} isColor="primary">
                        Dispense ETH
                    </Button>
                    <Button
                        isSize="small"
                        style={{ marginLeft: '10px' }}
                        id="dispenseZRX"
                        onClick={this.dispenseZRX}
                        isColor="primary"
                    >
                        Dispense ZRX
                    </Button> */}
                </Control>
            </Content>
        );
    }
    public dharma = async (): Promise<void> => {
        const dharma = new Dharma(this.props.web3Wrapper.getProvider());
        const { LoanRequest } = Dharma.Types;

        const loanRequest = await LoanRequest.create(dharma, {
            principalAmount: 1,
            principalToken: 'WETH',
            collateralAmount: 20,
            collateralToken: 'DAI',
            interestRate: 10,
            termDuration: 10,
            termUnit: 'years',
            expiresInDuration: 1,
            expiresInUnit: 'month',
        });

        console.log(loanRequest);

        await loanRequest.signAsDebtor();

        console.log(loanRequest.toJSON());

    }
    public dispenseZRX = async (): Promise<void> => {
        const addresses = await this.props.web3Wrapper.getAvailableAddressesAsync();
        const address = addresses[0];
        const url = `https://faucet.0xproject.com/zrx/${address}`;
        await fetch(url);
        console.log('Dispense ZRX requested');
    }
    public dispenseETH = async (): Promise<void> => {
        const addresses = await this.props.web3Wrapper.getAvailableAddressesAsync();
        const address = addresses[0];
        const url = `https://faucet.0xproject.com/ether/${address}`;
        await fetch(url);
        console.log('Dispense ETH requested');
    }
}
