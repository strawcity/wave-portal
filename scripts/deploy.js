async function main() {
    // const [deployer] = await hre.ethers.getSigners();
    // console.log("Deploying contracts with the account: ", deployer.address);
    // console.log("Account balance: ", (await deployer.getBalance()).toString());

    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({ value: ethers.utils.parseEther("0.1") });
    await waveContract.deployed()
    console.log("WavePortal address: ", waveContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
