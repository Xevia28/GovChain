export const GOVCHAIN_ADDRESS = '0x02ab3D1c025441aA493fa96Ea04Df085dc2b0f41'
// export const GOVCHAIN_ADDRESS = '0x941BFc6349E842eB92d7D3c507F17F6d964291f1'
// export const GOVCHAIN_OWNER_ADDRESS = '0x6476DeaF86aCA22A71a9bC6E95d66c672c73Cf4b'
export const GOVCHAIN_OWNER_ADDRESS = '0x8f84131BE7225d3eDFaEc750304c85cA3b9BC1a8'
export const GOVCHAIN_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "topicId",
                "type": "uint256"
            }
        ],
        "name": "TopicClosed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "topicId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "enum GovChain.TopicDecisionType",
                "name": "decision",
                "type": "uint8"
            }
        ],
        "name": "TopicCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "topicId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum GovChain.TopicDecisionType",
                "name": "decision",
                "type": "uint8"
            }
        ],
        "name": "TopicReopened",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "topicId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum GovChain.VoteOption",
                "name": "vote",
                "type": "uint8"
            }
        ],
        "name": "VoteCast",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "numTopics",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "reopenedTopics",
        "outputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "enum GovChain.TopicDecisionType",
                "name": "decision",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "isOpen",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "yesVotes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "noVotes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "neutralVotes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timesBroughtUp",
                "type": "uint256"
            },
            {
                "internalType": "enum GovChain.TopicStatus",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "token",
        "outputs": [
            {
                "internalType": "contract GovChainToken",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "topics",
        "outputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "enum GovChain.TopicDecisionType",
                "name": "decision",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "isOpen",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "yesVotes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "noVotes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "neutralVotes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timesBroughtUp",
                "type": "uint256"
            },
            {
                "internalType": "enum GovChain.TopicStatus",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "minutesToEnd",
                "type": "uint256"
            },
            {
                "internalType": "enum GovChain.TopicDecisionType",
                "name": "decision_type",
                "type": "uint8"
            },
            {
                "internalType": "address[]",
                "name": "parliamentMembers",
                "type": "address[]"
            }
        ],
        "name": "createTopic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_topicId",
                "type": "uint256"
            }
        ],
        "name": "closeTopic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_topicId",
                "type": "uint256"
            },
            {
                "internalType": "enum GovChain.VoteOption",
                "name": "_vote",
                "type": "uint8"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_topicId",
                "type": "uint256"
            },
            {
                "internalType": "enum GovChain.TopicDecisionType",
                "name": "decision_type",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "minutesToEnd",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "parliamentMembers",
                "type": "address[]"
            }
        ],
        "name": "reopenTopic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_topicId",
                "type": "uint256"
            }
        ],
        "name": "getTopicDetails",
        "outputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "enum GovChain.TopicDecisionType",
                "name": "decision",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "isOpen",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "yesVotes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "noVotes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "neutralVotes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            },
            {
                "internalType": "enum GovChain.TopicStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "timesBroughtUp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "getTokenBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_title",
                "type": "string"
            }
        ],
        "name": "topicAlreadyExists",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_topicId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_voter",
                "type": "address"
            }
        ],
        "name": "hasVoted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
]