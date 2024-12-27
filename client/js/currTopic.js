import { GOVCHAIN_OWNER_ADDRESS } from '/abi/govchain_abi.js';

window.addEventListener('contractReady', async (smartcontract) => {
    const { account, contract } = smartcontract.detail;
    document.querySelector(".loader-container").style.display = "flex";
    const topicCount = await contract.methods.numTopics().call();
    let topic;
    let id;
    for (var i = Number(topicCount); i >= Number(topicCount) / 2; i--) {
        id = i;
        topic = await contract.methods.topics(i).call();
        if (topic.isOpen) {
            break;
        }
    }
    if (!topic.isOpen) {
        document.querySelector(".details").innerHTML = "<p>No active topics at the moment</p>"
    } else {
        document.querySelector(".topicTitle").textContent += topic.title.charAt(0).toUpperCase() + topic.title.slice(1);
        document.querySelector(".topicDesc").textContent += topic.description;
        document.querySelector(".voteCount").textContent += Number(topic.yesVotes + topic.neutralVotes + topic.noVotes);
        document.querySelector(".details").innerHTML += `<button type="button" class="btn btn-primary w-25 p-2" id="submitTopicCloseButton">Close Topic</button>`
        document.getElementById("submitTopicCloseButton").addEventListener("click", async (e) => {
            e.preventDefault();
            if (account !== GOVCHAIN_OWNER_ADDRESS) {
                return alert("Only the owner can create topics. Make sure you have connected using the owner account!");
            }
            try {
                document.querySelector(".loader-container").style.display = "flex";
                let result = await contract.methods.closeTopic(id).send({ from: account });
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

    }
    document.querySelector(".loader-container").style.display = "none";
});