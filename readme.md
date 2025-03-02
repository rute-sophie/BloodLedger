# BloodLedger 🩸🏥

This is my turbin3 capstone project called BloodLedger.
BloodLedger is a decentralised Blood Donation Management System in Solana where healthcare professionals can have real-time access to blood inventory data (e.g., blood types and their availability) with tokenized incentives for donors. 

The goals are to help shortage by boosting donor engagement with a recognition system, enhance security by protecting sensitive donor and patient data using encrypted storage in solana blockchain, and to ensure timely access to blood supplies.

## Documentation

- [Letter of intent](docs/letter_of_intent.pdf)
- [User stories](docs/user_stories.pdf)
- [Architecture Design](docs/architecture_design.pdf)

## Project Structure

### Solana Program `/programs/bloodledger`

The Anchor-based Solana program that handles:

- Blood donation management
- Institution registration and inventory tracking
- Donor registration and reward system
- Blood unit lifecycle management

### Integration Tests `/tests/bloodledger.ts`

Comprehensive test suite covering:

- Program initialization
- Institution management
- Donor registration and tracking
- Blood donation workflows
- Reward distribution
- Error cases and edge conditions

### Web Interface `/app`

React-based user interface providing:

- Program monitoring and administration
- Institution management dashboard
- Donor registration and tracking
- Blood inventory management
See the [app README](app/README.md) for detailed features.

## Deployment

### Devnet Deployment

Program ID: [b1oodxpcTKPaXCUd5nnmTb8q85vRMfNmDLsqcqvUwwF](https://explorer.solana.com/address/b1oodxpcTKPaXCUd5nnmTb8q85vRMfNmDLsqcqvUwwF?cluster=devnet)

To interact with the deployed program:

1. Configure your wallet to Devnet
2. Ensure you have sufficient SOL (use devnet faucet if needed)
3. Run the React App (instructions bellow)

## Installation

### Prerequisites

- Node.js v18.18.0 or higher
- Rust v1.77.2 or higher
- Solana CLI 1.18.17 or higher
- Anchor CLI 0.30.1 or higher
- pnpm (for package management)

### Setup Steps

1. Clone the repository

```bash
git clone <repository-url>
cd bloodledger
```

2. Install dependencies

```bash
pnpm install
```

3. Build the Anchor program

```bash
anchor build
```

4. Deploy to localnet (for development)

```bash
anchor deploy --provider.cluster localnet
```

5. Start the web application

```bash
cd app
pnpm dev
```

## Development Workflow

### Local Development

1. Start a local validator:

```bash
solana-test-validator
```

2. Deploy the program:

```bash
anchor deploy --provider.cluster localnet
```

3. Run integration tests:

```bash
anchor test
```

4. Start the web interface:

```bash
cd app
pnpm dev
```

### Testing

- Run all tests: `anchor test`
- Run specific test: `anchor test --filter <test-name>`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
