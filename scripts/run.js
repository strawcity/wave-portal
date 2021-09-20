async function main() {
    const waveContractFactory = await hre.ethers.getContractFactory(
        "WavePortal"
    );
    const waveContract = await waveContractFactory.deploy({ value: hre.ethers.utils.parseEther("0.1") });
    await waveContract.deployed();
    console.log("Contract address: ", waveContract.address);

    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
    console.log('Contract balance: ', hre.ethers.utils.formatEther(contractBalance))

    let waveTxn = await waveContract.wave('Wave 1');
    await waveTxn.wait();
    console.log('Contract done mining')

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
    console.log('Balance: ', hre.ethers.utils.formatEther(contractBalance))

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
