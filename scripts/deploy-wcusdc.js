import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    throw new Error("Deployer has no ETH — get testnet ETH from https://faucet.triangleplatform.com/arbitrum/sepolia");
  }

  const Factory = await ethers.getContractFactory("WrappedConfidentialUSDC");
  console.log("\nDeploying WrappedConfidentialUSDC...");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\n✓ WrappedConfidentialUSDC deployed:", address);
  console.log("\nTambahkan ke .env.local:");
  console.log(`NEXT_PUBLIC_WRAPPED_USDC_ADDRESS=${address}`);
  console.log("\nTambahkan ke Vercel environment variables:");
  console.log(`NEXT_PUBLIC_WRAPPED_USDC_ADDRESS = ${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
