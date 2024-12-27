window.addEventListener('contractReady', async (smartcontract) => {
  const { account, contract } = smartcontract.detail; // get the contract once it loads from the web3_init.js
  document.querySelector(".loader-container").style.display = "flex";
  const topicCount = await contract.methods.numTopics().call();

  const resultSection = document.querySelector('.resultSection');
  const labelWrapper = document.querySelector('.labelWrapper');

  for (var i = 1; i <= topicCount; i++) {
    const topic = await contract.methods.topics(i).call();
    if (topic.isOpen) continue;
    const endDateTime = extractDateTime(Number(topic.endTime));
    const year = endDateTime.year;

    // Find or create the year container
    let yearContainer = document.querySelector(`.accordWrapper[data-year="${year}"]`);
    if (!yearContainer) {
      yearContainer = generateYearContainer(year);
      resultSection.appendChild(yearContainer);

      // Add year label
      const yearLabel = document.createElement('p');
      yearLabel.className = "yearid";
      yearLabel.setAttribute('name', year);
      yearLabel.textContent = year;
      labelWrapper.appendChild(yearLabel);
    }

    const session = endDateTime.month >= 1 && endDateTime.month <= 6 ? 'First' : 'Second';
    const sessionContainer = Array.from(yearContainer.querySelectorAll('.header h1'))
      .find(header => header.textContent.trim() === `${session} Session`)
      ?.parentElement?.nextElementSibling;

    if (sessionContainer) {
      sessionContainer.appendChild(generateVoteDetails(topic));
    }
  }

  // Add click event listeners for labels and accord items
  addEventListeners();

  document.querySelector(".loader-container").style.display = "none";
});

function addEventListeners() {
  const labels = document.querySelectorAll(".yearid");
  const accordWrappers = document.querySelectorAll(".accordWrapper");

  labels.forEach(label => {
    label.addEventListener('click', () => {
      // Remove active class from all labels and add to the clicked one
      labels.forEach(l => l.classList.remove("active"));
      label.classList.add("active");

      // Get the year from the clicked label
      const year = label.getAttribute("name");

      // Hide all accordWrappers and show the one that matches the year
      accordWrappers.forEach(wrapper => {
        if (wrapper.getAttribute("data-year") === year) {
          wrapper.classList.remove("hide");
        } else {
          wrapper.classList.add("hide");
        }
      });
    });
  });

  const active = document.querySelector('.labelWrapper .active');
  const initYear = active.getAttribute('name');
  accordWrappers.forEach(wrapper => {
    if (wrapper.getAttribute("data-year") === initYear) {
      wrapper.classList.remove("hide");
    } else {
      wrapper.classList.add("hide");
    }
  });

  var accords = document.querySelectorAll(".accordItem .header");
  accords.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      if (content.classList.contains("hideItem")) {
        content.classList.remove("hideItem");
      } else {
        content.classList.add("hideItem");
      }
    });
  });
}

function generateYearContainer(year) {
  const container = document.createElement('div');
  container.className = 'accordWrapper hide';
  container.setAttribute('data-year', year);
  container.innerHTML = `
    <div class="accordItem">
      <div class="header">
        <h1>First Session</h1>
        <span class="material-symbols-outlined">
          keyboard_arrow_down
        </span>
      </div>
      <div class="accordContent hideItem"></div>
    </div>
    <div class="accordItem">
      <div class="header">
        <h1>Second Session</h1>
        <span class="material-symbols-outlined">
          keyboard_arrow_down
        </span>
      </div>
      <div class="accordContent hideItem"></div>
    </div>
  `;
  return container;
}

function generateVoteDetails(data) {
  let timesBroughtUp = Number(data.timesBroughtUp);
  // console.log(timesBroughtUp)
  const decisionText = ["Majority", "2/3"];
  const statusText = ["Ongoing", "Approved", "Rejected", "No Decision"];
  const card = document.createElement('div');
  card.className = 'voteDetails'; // Changed class name to avoid duplicate .accordContent
  card.innerHTML = `
    <div class="contentTitle">
      <h1>${data.title.charAt(0).toUpperCase() + data.title.slice(1)}</h1>
    </div>
    <div class="content">
      <p>${data.description}</p>
    </div>
    <div class="votingWrapper">
      <div class="pool">
        <h2>Approval</h2>
        <p>${data.yesVotes}</p>
      </div>
      <div class="pool">
        <h2>Opposition</h2>
        <p>${data.noVotes}</p>
      </div>
      <div class="pool">
        <h2>Withholding</h2>
        <p>${data.neutralVotes}</p>
      </div>
    </div>
    <div class="resultWrapper">
      <p>${statusText[Number(data.status)]}</p>
      <p>Result Calculated Using ${decisionText[Number(data.decision)]} Decision</p>
    </div>
    <div class="dateWrapper">
      <p>Voting closed ${calculateTimePeriod(Number(data.endTime))}</p>
    </div>
    ${timesBroughtUp >= 2 ? `<div class="timesBroughtWrapper"><p>Times voted on: ${timesBroughtUp - 1}</p></div><div class="linkWrapper">${timesBroughtUp !== 1 ? `<a href="/reopened">View Previous Results</a>` : ''}</div>` : ''}
  `;
  return card;
}

function extractDateTime(timestamp) {
  // Convert timestamp to milliseconds
  let milliseconds = timestamp * 1000;
  // Create a new Date object
  let date = new Date(milliseconds);
  // Extract time components
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  // Extract date components
  let day = date.getDate();
  let month = date.getMonth() + 1; // Month is zero-based, so we add 1
  let year = date.getFullYear();

  return {
    time: `${hours}:${minutes}:${seconds}`,
    day: day,
    month: month,
    year: year
  };
}

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
