# GovChain

GovChain is a DAO-based decentralized voting platform designed specifically for the Parliament of Bhutan. It provides a transparent, secure, and automated solution for discussing and approving new topics or laws.

## Features

- **Decentralized Governance**: Built on DAO principles to promote fair and transparent decision-making.
- **Topic Creation**: Speakers or MPs can initiate new topics for discussion.
- **Automated Voting**: Parliament members can cast their votes within the specified time frame set by the speaker.
- **Auto-close Voting**: Voting closes automatically once the set time expires.
- **Real-time Results**: Results are calculated and displayed to the public immediately after the voting period ends.

## Technology Stack

- **Backend**:
  - [Express.js](https://expressjs.com/)
  - [Solidity](https://soliditylang.org/) for the smart contracts
  - [Node.js](https://nodejs.org/)
- **Frontend**:
  - HTML
  - CSS
  - JavaScript

## Installation and Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MetaMask](https://metamask.io/) or another Ethereum-compatible wallet

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/govchain.git
   cd govchain
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Compile Smart Contracts**:
   Use a Solidity compiler (e.g., Remix or Hardhat) to compile the smart contracts in the `contracts/` directory.

4. **Deploy Smart Contracts**:
   Deploy the contracts to your desired Ethereum test network (e.g., Rinkeby, Goerli) and note the contract address.

5. **Update Configurations**:
   Add the deployed contract address and ABI in the frontend code.

6. **Run the Application**:
   ```bash
   npm start
   ```
   Access the app in your browser at `http://localhost:3000`.

## Usage

1. **Speaker/MP**:

   - Log in using your Ethereum wallet.
   - Create a new topic for discussion, specifying the time frame for voting.

2. **Parliament Members**:

   - Log in using your Ethereum wallet.
   - View active topics and cast your vote.

3. **Public**:
   - View completed votes and their outcomes.

## Smart Contract Details

- **Functions**:
  - `createTopic`: Allows the speaker/MP to open a new topic for discussion.
  - `vote`: Enables members to cast their votes.
  - `closeVoting`: Automatically called after the voting period ends to finalize results.
  - `getResults`: Fetches and displays the voting outcome.

## Contributions

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or feedback, please contact [Jigme Namgyal](mailto:xeviabcd28@gmail.com).
