let countdowntime;


function startCountdown(endTimeUnix) {
    // Show the countdown clock
    document.getElementById("countdown").style.display = "flex";
    // Update the countdown every 1 second
    let x = setInterval(function () {
        // Get the current date and time in milliseconds
        let now = new Date().getTime();
        // Calculate the distance between now and the countdown date
        let distance = endTimeUnix - now;
        // If the countdown is over, display a message
        if (distance < 0) {
            clearInterval(x);
            let timePassed = calculateTimePassed(now, endTimeUnix);
            document.getElementById("countdown").innerHTML = `Time has passed (${timePassed})`;
            return; // Exit the function to stop further countdown updates
        }
        // Calculate minutes and seconds
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Display the result
        document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');
    }, 1000);
}

function calculateTimePassed(startTime, endTime) {
    let timePassedInMilliseconds = Math.abs(startTime - endTime);
    let timePassedInSeconds = Math.floor(timePassedInMilliseconds / 1000);

    if (timePassedInSeconds < 60) {
        return "Just now";
    } else if (timePassedInSeconds < 3600) { // Less than 1 hour
        let timePassedInMinutes = Math.floor(timePassedInSeconds / 60);
        if (timePassedInMinutes === 1) {
            return `${timePassedInMinutes} minute ago`;
        } else {
            return `${timePassedInMinutes} minutes ago`;
        }
    } else {
        let timePassedInHours = Math.floor(timePassedInSeconds / 3600);
        if (timePassedInHours === 1) {
            return `${timePassedInHours} hour ago`;
        } else {
            return `${timePassedInHours} hours ago`;
        }
    }
}

window.addEventListener('contractReady', async (smartcontract) => {
    const { account, contract } = smartcontract.detail; // get the contract once it loads from the web3_init.js
    document.querySelector(".loader-container").style.display = "flex";
    const topicCount = await contract.methods.numTopics().call();
    const topicId = Number(topicCount);
    const topic = await contract.methods.topics(topicId).call();

    if (topic.isOpen) {
        // if there is an active topic
        document.querySelector(".topic-title").innerText = topic.title.charAt(0).toUpperCase() + topic.title.slice(1);
        document.querySelector(".topic-desc").innerText = topic.description;
        // document.querySelector(".topic-endtime").innerText = Number(topic.endTime);

        startCountdown(Number(topic.endTime) * 1000); // Convert Unix time to milliseconds and start countdown

        document.getElementById("yes-btn").addEventListener("click", async (e) => {
            e.preventDefault();
            castVote("yes");
        });
        document.getElementById("no-btn").addEventListener("click", async (e) => {
            e.preventDefault();
            castVote("no");
        });
        document.getElementById("neutral-btn").addEventListener("click", async (e) => {
            e.preventDefault();
            castVote("neutral");
        });
    } else {
        // if there is no active topic
        document.querySelector(".voteCont").innerHTML = `<h1>No active topics at the moment.</h1>`
    }
    document.querySelector(".loader-container").style.display = "none";

    // const hasVoted = topic.hasVoted[account];
    // if (hasVoted) {
    //     document.querySelector(".btns").innerHTML = `<p>The address has already voted on this topic.</p>`
    //     return;
    // }


    async function castVote(option) {
        let vote;
        switch (option) {
            case "yes":
                vote = 0;
                break;
            case "no":
                vote = 1;
                break;
            case "neutral":
                vote = 2;
                break;
        }
        try {
            document.querySelector(".loader-container").style.display = "flex";
            let hasVoted = await contract.methods.hasVoted(topicId, account).call({ from: account });
            if (hasVoted) {
                document.querySelector(".loader-container").style.display = "none";
                return alert("You have already voted with this account!");
            }
            let tokenBalance = await contract.methods.getTokenBalance(account).call({ from: account });
            if (Number(tokenBalance) === 0) {
                document.querySelector(".loader-container").style.display = "none";
                return alert("You must have atleast one token in your account to vote!");
            }

            let result = await contract.methods.vote(topicId, vote).send({ from: account });
            // console.log(result);
            document.querySelector(".loader-container").style.display = "none";
            if (result.events.TopicClosed) alert("Voting time exceeded. Topic closed automatically!");
            if (result.events.VoteCast) alert("Vote submitted successfully!");
        } catch (error) {
            console.log(error.message);
            alert("An error occurred while processing your vote. Please check if you already voted or if you have atlease one token in your account.");
        }
    }
});