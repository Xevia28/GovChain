import { GOVCHAIN_ABI, GOVCHAIN_ADDRESS } from '/abi/govchain_abi.js';

let account;
export let contract;

window.onload = async () => {
    if (!window.ethereum) {
        console.error("No crypto wallet found. Please install it.");
        return;
    }

    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        connectWeb3();
    } catch (error) {
        console.error("Error connecting to crypto wallet:", error);
    }
};

async function connectWeb3() {
    const web3 = new Web3(window.ethereum);
    try {
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        console.log("Connected to metamask wallet.");
        // console.log("Connected to wallet. Accounts:", accounts);
        contract = new web3.eth.Contract(GOVCHAIN_ABI, GOVCHAIN_ADDRESS);
        window.dispatchEvent(new CustomEvent('contractReady', { detail: { account, contract } }));
    } catch (error) {
        console.error("Error getting accounts:", error);
    }
}

