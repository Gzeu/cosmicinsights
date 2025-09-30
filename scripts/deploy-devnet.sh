#!/usr/bin/env bash
set -euo pipefail

CONTRACT_DIR="contracts/ai-policy"
WASM="$CONTRACT_DIR/target/wasm32-unknown-unknown/release/ai_policy.wasm"
OWNER="${OWNER_ADDRESS:?set OWNER_ADDRESS}"
ORACLE="${ORACLE_ADDRESS:-$OWNER}"

# Build
( cd "$CONTRACT_DIR" && cargo build --release --target wasm32-unknown-unknown --no-default-features )

# Deploy with mxpy (ensure mxpy is installed and profile is set for devnet)
mxpy --verbose contract deploy --bytecode "$WASM" \
  --recall-nonce --gas-limit=120000000 \
  --proxy=https://devnet-gateway.multiversx.com \
  --chain=D \
  --pem="${WALLET_PEM:?set WALLET_PEM}" \
  --arguments ${ORACLE} \
  --send || true

echo "Deployed. Check transaction above for address."