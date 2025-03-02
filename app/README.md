# BloodLedger Web Application

A React-based web interface for the BloodLedger system, providing a comprehensive blood donation management platform on Solana blockchain.

## Features

### Program Status 🔍
- View program account details and deployment status
- Monitor program state on the Solana blockchain
- Real-time program account information display

### System Administration 👨‍💼
- Initialize system configuration
- Register new blood bank institutions
- View list of all registered institutions and their inventories
- Monitor institution details including:
  - Institution name
  - Owner's public key
  - Current blood inventory levels
  - Usage statistics

### Institution Management 🏥
- Manage blood bank inventory:
  - Track multiple blood types (A-, A+, B-, B+, AB-, AB+, O-, O+)
  - Monitor current units available
  - Track used units
  - Set demand levels (0-255) for each blood type
- Register new blood donations:
  - Record blood type
  - Assign unique unit IDs
  - Set expiry dates
  - Link donor wallet information
- Record used blood units:
  - Track usage by blood type
  - Monitor expiry status
  - Record health check results
  - Maintain donor information

### Donor Management 🩸
- Register new donors:
  - Record blood type
  - Link wallet address
- View donor information:
  - Blood type
  - Last donation date
  - Number of donations
  - Total rewards earned
  - Health check status
- Track donation history and rewards

## Getting Started

### Prerequisites

- Node v18.18.0 or higher
- Rust v1.77.2 or higher
- Anchor CLI 0.30.1 or higher
- Solana CLI 1.18.17 or higher
- Solana Wallet (for connecting to the application)

### Installation

#### Clone the repo

```shell
git clone <repo-url>
cd <repo-name>
```

#### Install Dependencies

```shell
pnpm install
```

#### Start the web app

```
pnpm dev
```

## Apps

### anchor

Refer to the [root](..) folder for the Anchor program.

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
pnpm dev
```

Build the web app

```shell
pnpm build
```
