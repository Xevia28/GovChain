import { GOVCHAIN_OWNER_ADDRESS } from '/abi/govchain_abi.js';

const selectCloseTopicId = document.getElementById("closetopic");
const selectReopenTopicId = document.getElementById("reopentopic");
// const selectDecision = document.getElementById("decisionSelect");
const votingTimeInput = document.getElementById('votingTimeInput');

window.addEventListener('contractReady', async (smartcontract) => {
    const { account, contract } = smartcontract.detail;
    let result = await axios.get("/api/user");
    let members = result.data.data;

    document.querySelector(".loader-container").style.display = "flex";
    const topicCount = await contract.methods.numTopics().call();
    for (var i = topicCount; i >= 1; i--) {
        const topic = await contract.methods.topics(i).call();
        // if (topic.timesBroughtUp == 2) {
        //     const res = await contract.methods.reopenedTopics(i, 0).call();
        //     console.log(res)
        // }
        if (topic.isOpen) {
            selectCloseTopicId.innerHTML += `<option value="${i}">Topic ${i}: ${topic.title.charAt(0).toUpperCase() + topic.title.slice(1)}</option>`;
        } else {
            if (topic.status == 3) {
                selectReopenTopicId.innerHTML += `<option value="${i}">Topic ${i}: ${topic.title.charAt(0).toUpperCase() + topic.title.slice(1)}</option>`;
            }
        }
    }

    if (selectCloseTopicId.innerHTML.trim() === "") {
        selectCloseTopicId.innerHTML = `<option disabled selected>No open topics found</option>`;
    }

    if (selectReopenTopicId.innerHTML.trim() === "") {
        selectReopenTopicId.innerHTML = `<option disabled selected>No closed topics found</option>`;
    }
    document.querySelector(".loader-container").style.display = "none";


    document.getElementById("submitTopicCloseButton").addEventListener("click", async (e) => {
        e.preventDefault();
        if (account !== GOVCHAIN_OWNER_ADDRESS) {
            return alert("Only the owner can create topics. Make sure you have connected using the owner account!");
        }
        try {
            document.querySelector(".loader-container").style.display = "flex";
            let result = await contract.methods.closeTopic(selectCloseTopicId.value).send({ from: account });
            console.log(result);
            // document.querySelector(".loader-container").style.display = "none";
            alert("Topic closed successfully");
            window.location.reload(true);
        } catch (error) {
            console.log(error);
            alert("An unexpected error occured. Check console for more details!");
            document.querySelector(".loader-container").style.display = "none";
        }
    });

    document.getElementById("submitTopicReopenButton").addEventListener("click", async (e) => {
        e.preventDefault();
        const isVotingTimeValid = validateVotingTime();
        if (!selectReopenTopicId.value || selectReopenTopicId.value === "No closed topics found" || !isVotingTimeValid) return alert("Please fill all the fields!");
        // if (!selectDecision.value || !selectReopenTopicId.value || !isVotingTimeValid) return alert("Please fill all the fields!");
        // let decisionType = decisionSelect.value === 'majority' ? 0 : 1;
        try {
            document.querySelector(".loader-container").style.display = "flex";
            let addresses = [];
            for (var i = 0; i < members.length; i++) {
                if (members[i].is_active && members[i].role === "user") {
                    addresses.push(members[i].walletAddress);
                }
            }
            const tpc = await contract.methods.topics(selectReopenTopicId.value).call();
            let result = await contract.methods.reopenTopic(selectReopenTopicId.value, Number(tpc.decision), votingTimeInput.value, addresses).send({ from: account });
            console.log(result);
            // document.querySelector(".loader-container").style.display = "none";
            alert("Topic reopened successfully");
            window.location.reload(true);
        } catch (error) {
            console.log(error);
            alert("An unexpected error occured. Check console for more details!");
            document.querySelector(".loader-container").style.display = "none";
        }
    })
});

function validateVotingTime() {
    const votingTimeError = document.getElementById('votingTimeError');
    const value = votingTimeInput.value.trim();
    const numericValue = parseInt(value, 10);

    if (isNaN(numericValue) || numericValue <= 0) {
        votingTimeError.style.display = 'block';
        votingTimeInput.classList.add('is-invalid');
        return false;
    } else {
        votingTimeError.style.display = 'none';
        votingTimeInput.classList.remove('is-invalid');
        return true;
    }
}

votingTimeInput.addEventListener('input', () => {
    const filteredValue = votingTimeInput.value.replace(/[^\d]/g, '');
    votingTimeInput.value = filteredValue;
    validateVotingTime();
});