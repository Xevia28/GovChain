window.addEventListener('contractReady', async (smartcontract) => {
    const { account, contract } = smartcontract.detail; // get the contract once it loads from the web3_init.js
    document.querySelector(".loader-container").style.display = "flex";
    const topicCount = await contract.methods.numTopics().call();
    let topic;
    for (var i = Number(topicCount); i >= Number(topicCount) / 2; i--) {
        topic = await contract.methods.topics(i).call();
        if (!topic.isOpen) {
            break;
        }
    }
    console.log("Latest closed topic:", topic);
    document.querySelector(".voting-result-header").innerText = topic.title;
    document.querySelector(".voting-result-detail").innerText = topic.description;
    document.querySelector(".yesCount").innerText = topic.yesVotes;
    document.querySelector(".noCount").innerText = topic.noVotes;
    document.querySelector(".neutralCount").innerText = topic.neutralVotes;
    const statusText = ["Ongoing", "Approved", "Rejected", "No Decision"];
    document.querySelector(".vote-decision").innerText = statusText[Number(topic.status)] || "No Decision";
    const line = document.querySelector(".voting-result-card");
    switch (Number(topic.status)) {
        case 1:
            line.classList.remove("vote-neutral")
            line.classList.add("vote-passed")
            break;
        case 2:
            line.classList.remove("vote-neutral")
            line.classList.add("vote-notpassed")
            break;
    }
    document.querySelector(".card-footer").innerText = calculateTimePeriod(Number(topic.endTime));
    document.querySelector(".loader-container").style.display = "none";
    // document.querySelector(".card-footer").innerText = calculateTimePeriod(Number(topic.endTime));
});


function calculateTimePeriod(endTimestamp) {
    const now = new Date(); // Current local time
    const end = new Date(endTimestamp * 1000); // End time (multiply by 1000 to convert seconds to milliseconds)
    // Calculate the time difference in milliseconds
    const timeDiff = now.getTime() - end.getTime();
    // Convert milliseconds to days
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    // Generate the output string based on the time difference
    if (daysDiff === 0 || daysDiff === -1) {
        // Same day or if topic closed before its closing time
        return 'Today';
    } else if (daysDiff === 1) {
        // Yesterday
        return 'Yesterday';
    } else if (daysDiff <= 7) {
        // Within the last week
        return `${daysDiff} days ago`;
    } else {
        // More than one week ago, show the exact date
        const day = String(end.getDate()).padStart(2, '0');
        const month = String(end.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = end.getFullYear();
        return `${day}/${month}/${year}`;
    }
}