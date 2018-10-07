# ethSF-2018

## Inspiration
I was exploring the idea of anonymous loans marketplace for the people who work at the same company (eg. Lyft, Facebook) based on verification of their institution. I think it would be fun but the market for that is really tiny. And then I realized that this could applied to student loans.

Current outstanding Student Loan debt is around $1.5 Trillion and growing. I think tokenizing it could bring more transparency to the marketplace and help improve rates.

There's also companies in Bay Area that started helping pay off student loans for their employees so I think this could be a great step forward.

## What it does
There's three parts:

1. Dapp that allows students create the loan and verify the identity
2. Dharma relayer that has the list of all the loans available and allows you to fill them
3. Graph Protocol subgraph that will be used in the future to help run queries on the loan data

## How I built it
Currently the key components are
* Dharma Relayer
* 0x.js for token conversions
* Dai.js to convert to Stablecoin
* Bloom for Identity
* Graph for queries

Not currently in the codebase, but tried adding:
* NuCypher for proxy re-encryption of parts of loan data
* Chainlink to do automated notifications upon contract changes and pulling in external data upon loan creation
* Bloqboard for loan scanning

## Challenges I ran into
* Due to time constraints had to cut down the scope significantly
* Dai.js doesn't support TypeScript at the moment
* My limited experience with Dharma and 0x
* NuCypher is currently only available in Python and Go so I didn't add it yet, but would be awesome to encrypt some of the data about the loans
* Didn't have enough time to implement Chainlink, but would be awesome to send out notifications once the loans are created

## Accomplishments that I'm proud of
It's a great first step and it's kinda working :)

## What I learned
* Dharma fundamentals and how to run it locally
* 0x basics
* How DAI works
* Bloom basics

## What's next for Tokenize Student Loans
Finish v1 and start on-boarding students, universities and companies

# dapp

To run the dapp locally:
```
yarn
yarn start
```

# Dharma-relayer

## Dependencies

To run the project, you'll first need to install the dependencies:

```
yarn
```

## Blockchain

And launch a local blockchain via:

```
yarn blockchain
```

## Backend

And launch the server via:

```
yarn server
```

## Frontend

And launch the React frontend via:

```
yarn start
```

# Subgraph (under construction)

To run the Graph locally follow https://github.com/graphprotocol/graph-node/wiki/ETHSF-Hackathon