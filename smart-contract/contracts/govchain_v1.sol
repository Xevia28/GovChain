// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GovChainToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1000000000 * (10 ** 18); // Initial supply of 1,000,000,000 tokens with 18 decimals
    string public constant NAME = "GovChainToken"; // Token name
    string public constant SYMBOL = "GCT"; // Token symbol
    uint256 public tokenConversionRate = 14; // 1 token is 20,000 BTN that would be 14.41 ETH

    constructor() ERC20(NAME, SYMBOL) Ownable() {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}

contract GovChain is Ownable {
    // struct to store the details of topics put up for discussion/voting
    struct Topic {
        string description;
        bool isOpen;
        mapping(address => bool) hasVoted;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 endTime; // Timestamp when the topic discussion period ends
    }

    uint256 public numTopics; // to track the number of topics created
    mapping(uint256 => Topic) public topics; // to store the all the topics created

    // struct to store the details of members in the parliament for voting
    struct ParliamentMember {
        string name;
        address walletAddress;
    }

    uint256 public numParliamentMembers; // to track the number of parliament members
    mapping(uint256 => ParliamentMember) public parliamentMembers; // to store all the members of the parliament

    mapping(address => bool) public isMember; // to track if a person is a member of the parliament (for voting)

    event TopicCreated(uint256 indexed topicId, string description);
    event VoteCast(uint256 indexed topicId, address indexed voter, bool vote);

    ERC20 public token; // to refer our token (GovChainToken)

    // IERC20 public token; // to refer our token (GovChainToken)

    // we set our token variable to the deployed token (GovChainToken) contract address in our constructor
    // constructor(address _tokenAddress) Ownable(msg.sender) {
    constructor() Ownable() {
        // token = IERC20(_tokenAddress);
        token = new GovChainToken();
    }

    // function to store a new parliament member in the system/contract
    function addParliamentMember(
        string memory _name,
        address _walletAddress
    ) external onlyOwner {
        require(
            _walletAddress != address(0),
            "Invalid wallet address (null wallet)"
        );
        require(
            !isMember[_walletAddress],
            "Address already registered in the system."
        );

        numParliamentMembers++; // increment the number of parliament members
        parliamentMembers[numParliamentMembers] = ParliamentMember(
            _name,
            _walletAddress
        ); // store the member in the system
        isMember[_walletAddress] = true; // Mark the address as registered
    }

    // function to replace an existing member with another new parliament member (this takes place after elections)
    function updateParliamentMember(
        uint256 _memberID,
        string memory _newName,
        address _newWalletAddress
    ) external onlyOwner {
        require(
            _memberID > 0 && _memberID <= numParliamentMembers,
            "Invalid member ID"
        );
        require(
            !isMember[_newWalletAddress],
            "New wallet address is already registered"
        );

        // Update the existing member with new values
        ParliamentMember storage member = parliamentMembers[_memberID];
        isMember[member.walletAddress] = false; // Mark the old address as not registered
        member.name = _newName;
        member.walletAddress = _newWalletAddress;
        isMember[_newWalletAddress] = true; // Mark the new address as registered
    }

    // function to store a new topic in the system/contract
    function createTopic(
        string memory _description,
        uint256 hoursToEnd
    ) external onlyOwner {
        require(bytes(_description).length > 0, "Description cannot be empty");
        numTopics++; // increment the number of topics created
        topics[numTopics].description = _description;
        topics[numTopics].isOpen = true; // modify the status to allow the topic to be voted on by members
        topics[numTopics].endTime = block.timestamp + (hoursToEnd * 1 hours);

        // Distribute tokens to parliament members for voting on this topic
        for (uint256 i = 1; i <= numParliamentMembers; i++) {
            token.transfer(parliamentMembers[i].walletAddress, 1); // give 1 token to each member
        }
        emit TopicCreated(numTopics, _description);
    }

    // function to close a topic
    function closeTopic(uint256 _topicId) external onlyOwner {
        require(_topicId > 0 && _topicId <= numTopics, "Invalid topic ID");
        require(topics[_topicId].isOpen, "Topic is already closed");
        topics[_topicId].isOpen = false; // modify the status to prevent the topic from being eligible for voting
    }

    // function to vote on a topic
    function vote(uint256 _topicId, bool _vote) external {
        require(_topicId > 0 && _topicId <= numTopics, "Invalid topic ID");
        require(topics[_topicId].isOpen, "Topic is closed");
        // Check if discussion period has ended
        if (block.timestamp >= topics[_topicId].endTime) {
            // Close the topic if the discussion period has ended
            topics[_topicId].isOpen = false;
            revert(
                "Discussion period for this topic has ended. Topic closed automatically."
            );
        }

        require(isMember[msg.sender], "Voter is not a parliament member");
        require(!topics[_topicId].hasVoted[msg.sender], "Already voted");

        // transfer a token to the contract from the sender's account
        require(
            token.transferFrom(msg.sender, address(this), 1),
            "Token transfer failed"
        );

        topics[_topicId].hasVoted[msg.sender] = true; // set the hasVoted to true for the voter

        if (_vote) {
            // if member voted yes
            topics[_topicId].yesVotes++;
        } else {
            // if member voted no
            topics[_topicId].noVotes++;
        }

        emit VoteCast(_topicId, msg.sender, _vote); // Emitting 1 vote
    }

    // function to get the details of a topic
    function getTopicDetails(
        uint256 _topicId
    )
        external
        view
        returns (
            string memory description,
            bool isOpen,
            uint256 yesVotes,
            uint256 noVotes
        )
    {
        require(_topicId > 0 && _topicId <= numTopics, "Invalid topic ID");
        Topic storage topic = topics[_topicId];
        return (topic.description, topic.isOpen, topic.yesVotes, topic.noVotes);
    }
}
