import { GOVCHAIN_OWNER_ADDRESS } from '/abi/govchain_abi.js';

const topicInput = document.getElementById('topicInput');
const descriptionTextarea = document.getElementById('descriptionTextarea');
const votingTimeInput = document.getElementById('votingTimeInput');
const decisionSelect = document.getElementById('decisionSelect');
const submitButton = document.getElementById('submitButton');

function validateTopic() {
    const topicError = document.getElementById('topicError');
    if (topicInput.value.trim() === '') {
        topicError.style.display = 'block';
        topicInput.classList.add('is-invalid');
        return false;
    } else {
        topicError.style.display = 'none';
        topicInput.classList.remove('is-invalid');
        return true;
    }
}

function validateDescription() {
    const descriptionError = document.getElementById('descriptionError');
    if (descriptionTextarea.value.trim() === '') {
        descriptionError.style.display = 'block';
        descriptionTextarea.classList.add('is-invalid');
        return false;
    } else {
        descriptionError.style.display = 'none';
        descriptionTextarea.classList.remove('is-invalid');
        return true;
    }
}

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

function validateDecisionType() {
    const decisionError = document.getElementById('decisionError');
    if (!decisionSelect.value) {
        decisionError.style.display = 'block';
        decisionSelect.classList.add('is-invalid');
        return false;
    } else {
        decisionError.style.display = 'none';
        decisionSelect.classList.remove('is-invalid');
        return true;
    }
}

votingTimeInput.addEventListener('input', () => {
    const filteredValue = votingTimeInput.value.replace(/[^\d]/g, '');
    votingTimeInput.value = filteredValue;
    validateVotingTime();
});

window.addEventListener('contractReady', async (smartcontract) => {
    const { account, contract } = smartcontract.detail;
    let result = await axios.get("/api/user");
    let members = result.data.data;

    // console.log(contract.methods);
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const isTopicValid = validateTopic();
        const isDescriptionValid = validateDescription();
        const isVotingTimeValid = validateVotingTime();
        const isDecisionTypeValid = validateDecisionType();

        if (!isTopicValid || !isDescriptionValid || !isVotingTimeValid || !isDecisionTypeValid) {
            return alert("Submission is invalid. Please correct the errors.");
        }

        if (account !== GOVCHAIN_OWNER_ADDRESS) {
            return alert("Only the owner can create topics. Make sure you have connected using the owner account!");
        }

        let title = document.getElementById("topicInput").value.toLowerCase();
        let description = document.getElementById("descriptionTextarea").value;
        let minutes = document.getElementById("votingTimeInput").value;
        let decisionType = decisionSelect.value === 'majority' ? 0 : 1;
        console.log(title, description, minutes, decisionType);

        let topicExists = await contract.methods.topicAlreadyExists(title).call({ from: account });
        if (topicExists) return alert("The topic with the same name already exists");

        try {
            document.querySelector(".loader-container").style.display = "flex";
            let addresses = [];
            for (var i = 0; i < members.length; i++) {
                if (members[i].is_active && members[i].role === "user") {
                    addresses.push(members[i].walletAddress);
                }
            }
            let result = await contract.methods.createTopic(title, description, minutes, decisionType, addresses).send({ from: account });
            console.log(result);
            document.querySelector(".loader-container").style.display = "none";
            alert("Topic created successfully!");
            window.location.reload(true);
        } catch (error) {
            console.log(error.message);
            alert("An error occurred while creating topic. Please check if you already created the topic with the same name or if you are the contract owner");
            document.querySelector(".loader-container").style.display = "none";
        }

    })
});