const GovChain = artifacts.require("GovChain");
const timeMachine = require('ganache-time-traveler');

contract("GovChain", (accounts) => {
    let govChainInstance;

    before(async () => {
        govChainInstance = await GovChain.deployed();
    });

    it("should create a topic", async () => {
        const description = "Discuss budget allocation";
        const topicTitle = "Budget Allocation";

        await govChainInstance.createTopic(
            topicTitle,
            description,
            60, // 1 hour
            0, // Majority decision type
            [accounts[1], accounts[2]]
        );

        const topicDetails = await govChainInstance.getTopicDetails(1);
        assert.equal(topicDetails.title, topicTitle, "Topic title is incorrect");
        assert.equal(topicDetails.description, description, "Topic description is incorrect");
        assert.equal(topicDetails.decision, 0, "Topic decision type is incorrect");
        assert.isTrue(topicDetails.isOpen, "Topic should be open");
        assert.equal(topicDetails.yesVotes, 0, "Initial yes votes should be 0");
        assert.equal(topicDetails.noVotes, 0, "Initial no votes should be 0");
        assert.equal(topicDetails.neutralVotes, 0, "Initial neutral votes should be 0");
        assert.equal(topicDetails.timesBroughtUp, 1, "Initial times brought up should be 1");
    });

    it("should not allow creating the same topic", async () => {
        try {
            const description = "Discuss budget allocation";
            await govChainInstance.createTopic(
                "Budget Allocation",
                description,
                60,
                0,
                [accounts[1], accounts[2]]
            );
            assert.fail("Creating the same topic should fail");
        } catch (error) {
            assert.include(error.message, "Topic already exists", "Unexpected error message");
        }
    });

    it("should manually close a topic", async () => {
        await govChainInstance.closeTopic(1, { from: accounts[0] });
        const topicDetails = await govChainInstance.getTopicDetails(1);
        assert.isFalse(topicDetails.isOpen, "Topic should be closed");
    });

    it("should check voting twice", async () => {
        try {
            const description2 = "Discuss budget allocation";
            const topicTitle2 = "Budget Allocation 2";

            await govChainInstance.createTopic(
                topicTitle2,
                description2,
                60, // 1 hour
                0, // Majority decision type
                [accounts[1], accounts[2]]
            );
            await govChainInstance.vote(2, 0, { from: accounts[1] });
            await govChainInstance.vote(2, 0, { from: accounts[1] });
            assert.fail("Voting twice should fail");
        } catch (error) {
            if (error.message.includes("Topic is closed")) {
                // Voting twice should fail because the topic is closed
                assert.include(error.message, "Topic is closed", "Unexpected error message");
            } else {
                // If the error is not due to the topic being closed, check for "Already voted" error
                assert.include(error.message, "Already voted", "Unexpected error message");
            }
        }
    });


    it("should check voting to invalid topic ID", async () => {
        try {
            await govChainInstance.vote(43, 0, { from: accounts[1] });
            assert.fail("Voting to invalid topic ID should fail");
        } catch (error) {
            assert.include(error.message, "Invalid topic ID", "Unexpected error message");
        }
    });

    it("should check voting to closed topic", async () => {
        try {
            await govChainInstance.vote(1, 0, { from: accounts[1] });
            assert.fail("Voting to closed topic should fail");
        } catch (error) {
            assert.include(error.message, "Topic is closed", "Unexpected error message");
        }
    });

    it("should check voting to topic that reached deadline", async () => {
        // Advance time to after the discussion period
        await timeMachine.advanceTimeAndBlock(61 * 60); // 61 minutes

        try {
            await govChainInstance.vote(1, 0, { from: accounts[1] });
            assert.fail("Voting to topic that reached deadline should fail");
        } catch (error) {
            assert.include(error.message, "Topic is closed", "Unexpected error message");
        }
    });

    it("should check topic status and isOpen after voting to topic that reached deadline", async () => {
        const topicDetails = await govChainInstance.getTopicDetails(1);
        assert.isFalse(topicDetails.isOpen, "Topic should be closed");
        assert.equal(topicDetails.status, 3, "Topic status should be NoDecision");
    });

    it("should check voting with no token", async () => {
        try {
            await govChainInstance.vote(2, 0, { from: accounts[3] });
            assert.fail("Voting with no token should fail");
        } catch (error) {
            assert.include(error.message, "Insufficient token balance", "Unexpected error message");
        }
    });

    it("should check topic details after voting", async () => {
        const topicDetails = await govChainInstance.getTopicDetails(1);
        assert.equal(topicDetails.yesVotes, 0, "Yes votes should remain 0");
        assert.equal(topicDetails.noVotes, 0, "No votes should remain 0");
        assert.equal(topicDetails.neutralVotes, 0, "Neutral votes should remain 0");
        assert.equal(topicDetails.timesBroughtUp, 1, "Times brought up should remain the same");
    });
});