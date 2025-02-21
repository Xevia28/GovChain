// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract GovChain_v3Token_v3 is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** 18); // Initial supply of 1,000,000 tokens with 18 decimals
    string public constant NAME = "GovChain_v3Token_v3"; // Token name
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

contract GovChain_v3 is Ownable {
    using SafeMath for uint256;

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
        mapping(address => bool) hasVoted; // to keep track of who voted on the topic
        uint256 yesVotes; // number of yes votes
        uint256 noVotes; // number of no votes
        uint256 neutralVotes; // number of neutral votes
        uint256 endTime; // Timestamp when the topic discussion period ends
        uint256 timesBroughtUp; // number of times the topic has been brought up
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

    GovChain_v3Token_v3 public token; // to refer our token (GovChain_v3Token_v3)

    // IERC20 public token; // to refer our token (GovChain_v3Token_v3)

    // we set our token variable to the deployed token (GovChain_v3Token_v3) contract address in our constructor
    // constructor(address _tokenAddress) Ownable() {
    constructor() Ownable() {
        // token = IERC20(_tokenAddress);
        token = new GovChain_v3Token_v3();
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
        numTopics++; // increment the number of topics created
        topics[numTopics].title = _title;
        topics[numTopics].description = _description;
        topics[numTopics].isOpen = true; // modify the status to allow the topic to be voted on by members
        topics[numTopics].endTime =
            block.timestamp +
            (minutesToEnd * 1 minutes);
        topics[numTopics].decision = decision_type;
        topics[numTopics].timesBroughtUp = 1;
        topics[numTopics].hasVoted[msg.sender] = true;

        topicExists[_title] = true;
        // Distribute tokens to parliament members for voting on this topic
        for (uint256 i = 0; i < parliamentMembers.length; i++) {
            token.transfer(parliamentMembers[i], 1); // give 1 token to each member
        }
        emit TopicCreated(numTopics, _title, _description, decision_type);
    }

    function closeTopic(uint256 _topicId) external onlyOwner {
        require(_topicId > 0 && _topicId <= numTopics, "Invalid topic ID");
        require(topics[_topicId].isOpen, "Topic is already closed");
        Topic storage topic = topics[_topicId];
        topic.isOpen = false; // modify the status to prevent the topic from being eligible for voting
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
            Topic storage topic = topics[_topicId];
            topic.isOpen = false; // modify the status to prevent the topic from being eligible for voting
            emit TopicClosed(_topicId);
            return;
        }
        token.transferTokens(msg.sender, address(this), 1);

        topics[_topicId].hasVoted[msg.sender] = true; // set the hasVoted to true for the voter

        if (_vote == VoteOption.Yes) {
            // if member voted yes
            topics[_topicId].yesVotes++;
        } else if (_vote == VoteOption.No) {
            // if member voted no
            topics[_topicId].noVotes++;
        } else {
            // if member voted neutral
            topics[_topicId].neutralVotes++;
        }

        emit VoteCast(_topicId, msg.sender, _vote); // Emitting 1 vote
    }

    // Function to reopen a topic for voting
    function reopenTopic(
        uint256 _topicId,
        TopicDecisionType decision_type,
        uint256 minutesToEnd
    ) external onlyOwner {
        require(_topicId > 0 && _topicId <= numTopics, "Invalid topic ID");
        require(!topics[_topicId].isOpen, "Topic is already open");

        uint256 idx = reopenedTopics[_topicId].length;
        reopenedTopics[_topicId].push();
        Topic storage topic = reopenedTopics[_topicId][idx];
        topic.yesVotes = topics[_topicId].yesVotes;
        topic.noVotes = topics[_topicId].noVotes;
        topic.neutralVotes = topics[_topicId].neutralVotes;
        topic.endTime = topics[_topicId].endTime;
        topic.decision = topics[_topicId].decision;

        // Reinitialize attributes for the reopened topic
        topics[_topicId].isOpen = true;
        topics[_topicId].yesVotes = 0;
        topics[_topicId].noVotes = 0;
        topics[_topicId].neutralVotes = 0;
        topics[_topicId].endTime = block.timestamp + (minutesToEnd * 1 minutes);
        topics[_topicId].decision = decision_type;
        topics[_topicId].timesBroughtUp++; // Increment timesBroughtUp for reopened topic

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
            topic.timesBroughtUp
        );
    }

    function getTokenBalance(address account) external view returns (uint256) {
        uint256 balance = token.balanceOf(account);
        return balance;
    }
}
