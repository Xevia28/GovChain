window.addEventListener('contractReady', async (smartcontract) => {
    const { account, contract } = smartcontract.detail; // get the contract once it loads from the web3_init.js
    document.querySelector(".loader-container").style.display = "flex";
    const topicCount = await contract.methods.numTopics().call();
    const resultContainer = document.querySelector(".results-container");
    const statusText = ["Ongoing", "Approved", "Rejected", "No Decision"];
    const timesBroughtUpText = ["First term", "Second term", "Third term", "Fourth term"];
    const decisionText = ["Majority", "2/3"];

    for (var i = 1; i <= topicCount; i++) {
        const topic = await contract.methods.topics(i).call();
        if (topic.timesBroughtUp === 1) continue;
        let topicId = i;
        let c = Number(topic.timesBroughtUp) - 2;
        for (var j = 0; j <= c; j++) {
            let tpc = await contract.methods.reopenedTopics(topicId, j).call();
            console.log(tpc);
            // Create HTML elements dynamically
            const votingResultDiv = document.createElement('div');
            votingResultDiv.className = 'voting-result-div';
            const votingDetailContainer = document.createElement('div');
            votingDetailContainer.className = 'voting-detail-container';
            const votingResultHeader = document.createElement('div');
            votingResultHeader.className = 'voting-result-header';
            votingResultHeader.textContent = topic.title;
            const votingResultDetail = document.createElement('div');
            votingResultDetail.className = 'voting-result-detail';
            votingResultDetail.textContent = topic.description;
            const cardFooterTerm = document.createElement('div');
            cardFooterTerm.className = 'card-footer text-secondary';
            cardFooterTerm.textContent = timesBroughtUpText[j];
            const cardFooterTime = document.createElement('div');
            cardFooterTime.className = 'card-footer text-secondary';
            cardFooterTime.textContent = calculateTimePeriod(Number(topic.endTime));

            votingDetailContainer.appendChild(votingResultHeader);
            votingDetailContainer.appendChild(votingResultDetail);
            votingDetailContainer.appendChild(cardFooterTerm);
            votingDetailContainer.appendChild(cardFooterTime);

            const votingResultCard = document.createElement('div');
            votingResultCard.className = Number(tpc.status) === 1 ? 'voting-result-card vote-passed' : Number(tpc.status) === 2 ? 'voting-result-card vote-notpassed' : 'voting-result-card vote-neutral';

            votingResultCard.appendChild(createVoteCountContainer('Approval', tpc.yesVotes));
            votingResultCard.appendChild(createVoteCountContainer('Opposition', tpc.noVotes));
            votingResultCard.appendChild(createVoteCountContainer('Withholding', tpc.neutralVotes));

            const showDecisionType = document.createElement('div');
            showDecisionType.className = 'show-decision-type';
            showDecisionType.textContent = `Result calculated using ${decisionText[Number(tpc.decision)]} Decision`;

            const voteResult = document.createElement('div');
            voteResult.className = 'vote-result vote-decision';
            voteResult.textContent = statusText[Number(tpc.status)];

            votingResultCard.appendChild(showDecisionType);
            votingResultCard.appendChild(voteResult);

            votingResultDiv.appendChild(votingDetailContainer);
            votingResultDiv.appendChild(votingResultCard);

            resultContainer.appendChild(votingResultDiv);
        }
    }
    document.querySelector(".loader-container").style.display = "none";
});

const createVoteCountContainer = (label, count) => {
    const container = document.createElement('div');
    container.className = 'vote-count-container';

    const resultDetail = document.createElement('div');
    resultDetail.className = 'result-detail';
    resultDetail.textContent = label;

    const resultCount = document.createElement('div');
    resultCount.className = `result-count ${label.toLowerCase()}Count`;
    resultCount.textContent = count;

    container.appendChild(resultDetail);
    container.appendChild(resultCount);

    return container;
};

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