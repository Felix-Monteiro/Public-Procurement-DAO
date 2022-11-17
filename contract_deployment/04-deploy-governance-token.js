const {ethers} = require("hardhat");

async function deployGovernanceToken() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account: ", deployer.address);
  console.log("Account balance: ", (await deployer.getBalance()).toString());

  const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
  const governanceToken = await GovernanceToken.deploy();

  console.log("Governance Token Contract address: ", governanceToken.address);
}

deployGovernanceToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  