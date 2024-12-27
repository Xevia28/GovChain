// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract GovChainToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** 18); // Initial supply of 1,000,000 tokens with 18 decimals
    string public constant NAME = "GovChainToken"; // Token name
    string public constant SYMBOL = "GCT"; // Token symbol
    uint256 public tokenConversionRate = 14; // 1 token is 20,000 BTN that would be 14.41 ETH

    constructor() ERC20(NAME, SYMBOL) Ownable() {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function transferTokens(
        address sender,
        address recipient,
        uint256 amount
    ) public {
        _transfer(sender, recipient, amount);
    }
}

contract GovChain is Ownable {
    using SafeMath for uint256;
    // Enum to represent the status of the topic
    enum TopicStatus {
        Ongoing, // Topic is currently open for voting
        Approved, // Topic has been approved by the voting process
        Rejected, // Topic has been rejected by the voting process
        NoDecision // Topic has ended without a clear decision due to insufficient votes or other reasons
    }

    // Enum to represent how the decision would be made for the topic
    enum TopicDecisionType {
        Majority, // Result calculated via majority vote
        Two_third // Result calculated via 2/3 vote
    }

    // an enum to represent the voting options
    enum VoteOption {
        Yes,
        No,
        Neutral
    }

    // struct to store the details of topics put up for discussion/voting
    struct Topic {
        string title; // the topic title
        string description; // the topic description
        TopicDecisionType decision; // to determine how the results would be calculated (majority, 2/3)
        bool isOpen; // to check if the topic is open for voting
        address[] voters; // Array to keep track of who voted on the topic
        mapping(address => bool) hasVoted; // to keep track of who voted on the topic
        uint256 yesVotes; // number of yes votes
        uint256 noVotes; // number of no votes
        uint256 neutralVotes; // number of neutral votes
        uint256 endTime; // Timestamp when the topic discussion period ends
        uint256 timesBroughtUp; // number of times the topic has been brought up
        TopicStatus status; // to keep track of the status of the topic ("ongoing, approved, rejected, nodecision")
    }

    uint256 public numTopics; // to track the number of topics created
    mapping(uint256 => Topic) public topics; // to store the all the topics created
    mapping(uint256 => Topic[]) public reopenedTopics; // to store the details of topics before its reopened
    mapping(string => bool) private topicExists; // to check if a topic already exists

    event TopicCreated(
        uint256 indexed topicId,
        string title,
        string description,
        TopicDecisionType decision
    );
    event TopicReopened(uint256 indexed topicId, TopicDecisionType decision);
    event TopicClosed(uint256 indexed topicId);
    event VoteCast(
        uint256 indexed topicId,
        address indexed voter,
        VoteOption vote
    );

    GovChainToken public token; // to refer our token (GovChainToken)

    // IERC20 public token; // to refer our token (GovChainToken)

    // we set our token variable to the deployed token (GovChainToken) contract address in our constructor
    // constructor(address _tokenAddress) Ownable() {
    constructor() Ownable() {
        // token = IERC20(_tokenAddress);
        token = new GovChainToken();
    }

    // function to store a new topic in the system/contract
    function createTopic(
        string memory _title,
        string memory _description,
        uint256 minutesToEnd,
        TopicDecisionType decision_type, // the enum index for the decision type
        address[] memory parliamentMembers
    ) external onlyOwner {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(!topicExists[_title], "Topic already exists");
        numTopics = numTopics.add(1); // increment the number of topics created
        topics[numTopics].title = _title;
        topics[numTopics].description = _description;
        topics[numTopics].isOpen = true; // modify the status to allow the topic to be voted on by members
        topics[numTopics].endTime = block.timestamp.add(
            minutesToEnd.mul(1 minutes)
        );
        topics[numTopics].decision = decision_type;
        topics[numTopics].status = TopicStatus.Ongoing;
        topics[numTopics].timesBroughtUp = 1;

        topicExists[_title] = true;

        // Distribute tokens to parliament members for voting on this topic
        for (uint256 i = 0; i < parliamentMembers.length; i++) {
            token.transfer(parliamentMembers[i], 1); // give 1 token to each member
        }
        emit TopicCreated(numTopics, _title, _description, decision_type);
    }

    // function to close a topic
    function _closeTopic(uint256 _topicId) private {
        Topic storage topic = topics[_topicId];
        topic.isOpen = false; // modify the status to prevent the topic from being eligible for voting

        uint256 totalVotes = topic.yesVotes.add(topic.noVotes).add(
            topic.neutralVotes
        );

        uint256 majorityThreshold = totalVotes.div(2).add(1); // Majority threshold is more than half of the votes cast

        uint256 twoThirdsThreshold = totalVotes.mul(2).div(3); // Two-thirds threshold is 2/3 of the total votes

        if (topic.decision == TopicDecisionType.Majority) {
            // Majority vote
            if (topic.yesVotes >= majorityThreshold) {
                // Topic is approved if yes votes are greater than or equal to majority threshold
                topic.status = TopicStatus.Approved;
            } else if (topic.noVotes >= majorityThreshold) {
                // Topic is rejected otherwise
                topic.status = TopicStatus.Rejected;
            } else {
                // otherwise there is no decision
                topic.status = TopicStatus.NoDecision;
            }
        } else {
            // 2/3 vote
            if (topic.yesVotes > twoThirdsThreshold) {
                // Topic is approved if yes votes are greater than or equal to two-thirds threshold
                topic.status = TopicStatus.Approved;
            } else if (topic.noVotes > twoThirdsThreshold) {
                // Topic is rejected if no votes are greater than or equal to two-thirds threshold
                topic.status = TopicStatus.Rejected;
            } else {
                // otherwise there is no decision
                topic.status = TopicStatus.NoDecision;
            }
        }
    }

    function closeTopic(uint256 _topicId) external onlyOwner {
        require(_topicId > 0 && _topicId <= numTopics, "Invalid topic ID");
        require(topics[_topicId].isOpen, "Topic is already closed");
        _closeTopic(_topicId);
        emit TopicClosed(_topicId);
    }

    // function to vote on a topic
    function vote(uint256 _topicId, VoteOption _vote) external {
        require(_topicId > 0 && _topicId <= numTopics, "Invalid topic ID");
        require(topics[_topicId].isOpen, "Topic is closed");
        require(!topics[_topicId].hasVoted[msg.sender], "Already voted");
        require(
            token.balanceOf(msg.sender) >= 1,
            "Insufficient token balance! The voter must have atleast one token!"
        );

        // Check if discussion period has ended
        if (
            topics[_topicId].isOpen &&
            block.timestamp >= topics[_topicId].endTime
        ) {
            _closeTopic(_topicId);
            emit TopicClosed(_topicId);
            return;
        }

        token.transferTokens(msg.sender, address(this), 1);

        if (_vote == VoteOption.Yes) {
            // if member voted yes
            topics[_topicId].yesVotes = topics[_topicId].yesVotes.add(1); // increment the number of yes votes
        } else if (_vote == VoteOption.No) {
            // if member voted no
            topics[_topicId].noVotes = topics[_topicId].noVotes.add(1); // increment the number of no votes
        } else {
            // if member voted neutral
            topics[_topicId].neutralVotes = topics[_topicId].neutralVotes.add(
                1
            ); // increment the number of neutral votes
        }

        topics[_topicId].hasVoted[msg.sender] = true; // set the hasVoted to true for the voter
        topics[_topicId].voters.push(msg.sender); // push the voter address to the array

        emit VoteCast(_topicId, msg.sender, _vote); // Emitting 1 vote
    }

    // Function to reopen a topic for voting
    function reopenTopic(
        uint256 _topicId,
        TopicDecisionType decision_type,
        uint256 minutesToEnd,
        address[] memory parliamentMembers
    ) external onlyOwner {
        require(_topicId > 0 && _topicId <= numTopics, "Invalid topic ID");
        require(!topics[_topicId].isOpen, "Topic is already open");
        require(
            topics[_topicId].status == TopicStatus.NoDecision,
            "Topic can be reopened only if there was no decision!"
        );

        uint256 idx = reopenedTopics[_topicId].length;
        reopenedTopics[_topicId].push();
        Topic storage topic = reopenedTopics[_topicId][idx];
        topic.yesVotes = topics[_topicId].yesVotes;
        topic.noVotes = topics[_topicId].noVotes;
        topic.neutralVotes = topics[_topicId].neutralVotes;
        topic.endTime = topics[_topicId].endTime;
        topic.decision = topics[_topicId].decision;
        topic.status = topics[_topicId].status;

        // Reinitialize attributes for the reopened topic
        topics[_topicId].isOpen = true;
        topics[_topicId].yesVotes = 0;
        topics[_topicId].noVotes = 0;
        topics[_topicId].neutralVotes = 0;
        topics[_topicId].endTime = block.timestamp.add(
            minutesToEnd.mul(1 minutes)
        );
        topics[_topicId].decision = decision_type;
        topics[_topicId].status = TopicStatus.Ongoing;
        topics[_topicId].timesBroughtUp = topics[_topicId].timesBroughtUp.add(
            1
        ); // Increment timesBroughtUp for reopened topic

        // Reset the hasVoted mapping
        for (uint256 i = 0; i < topics[_topicId].voters.length; i++) {
            address voter = topics[_topicId].voters[i];
            topics[_topicId].hasVoted[voter] = false;
        }
        delete topics[_topicId].voters; // Clear the voters array

        // Distribute tokens to parliament members for voting on this topic
        for (uint256 i = 0; i < parliamentMembers.length; i++) {
            token.transfer(parliamentMembers[i], 1); // give 1 token to each member
        }

        emit TopicReopened(_topicId, decision_type);
    }

    // function to get the details of a topic
    function getTopicDetails(
        uint256 _topicId
    )
        external
        view
        returns (
            string memory title,
            string memory description,
            TopicDecisionType decision,
            bool isOpen,
            uint256 yesVotes,
            uint256 noVotes,
            uint256 neutralVotes,
            uint256 endTime,
            TopicStatus status,
            uint256 timesBroughtUp
        )
    {
        require(_topicId > 0 && _topicId <= numTopics, "Invalid topic ID");
        Topic storage topic = topics[_topicId];
        return (
            topic.title,
            topic.description,
            topic.decision,
            topic.isOpen,
            topic.yesVotes,
            topic.noVotes,
            topic.neutralVotes,
            topic.endTime,
            topic.status,
            topic.timesBroughtUp
        );
    }

    function getTokenBalance(address account) external view returns (uint256) {
        uint256 balance = token.balanceOf(account);
        return balance;
    }

    function topicAlreadyExists(
        string memory _title
    ) external view returns (bool) {
        return topicExists[_title];
    }

    function hasVoted(
        uint256 _topicId,
        address _voter
    ) external view returns (bool) {
        return topics[_topicId].hasVoted[_voter];
    }
}
