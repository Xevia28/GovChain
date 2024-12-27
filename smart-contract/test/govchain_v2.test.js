// const GovChain = artifacts.require("GovChain");
// const timeMachine = require('ganache-time-traveler');

// contract("GovChain", (accounts) => {
//     let govChainInstance;

//     before(async () => {
//         govChainInstance = await GovChain.deployed();
//     });

//     it("should create a topic", async () => {
//         const description = "Discuss budget allocation";
//         await govChainInstance.createTopic(description, 1, [accounts[1], accounts[2]], { from: accounts[0] });

//         const topicDetails = await govChainInstance.getTopicDetails(1);
//         assert.equal(topicDetails.description, description, "Failed to create topic");
//         assert.isTrue(topicDetails.isOpen, "Failed to create open topic");
//     });

//     it("should not allow non-owners to create a topic", async () => {
//         try {
//             const description = "Discuss budget allocation";
//             await govChainInstance.createTopic(description, 1, [accounts[1], accounts[2]], { from: accounts[1] });
//             assert.fail("Non-owner was able to create a topic");
//         } catch (error) {
//             assert.include(error.message, "Ownable: caller is not the owner", "Unexpected error message");
//         }
//     });

//     it("should not allow voting on a closed topic", async () => {
//         await govChainInstance.closeTopic(1, { from: accounts[0] });

//         try {
//             await govChainInstance.vote(1, true, { from: accounts[1] });
//             assert.fail("Voted on a closed topic");
//         } catch (error) {
//             assert.include(error.message, "Topic is closed", "Unexpected error message");
//         }
//     });

//     it("should vote on a topic", async () => {
//         try {
//             await govChainInstance.vote(1, true, { from: accounts[1] });
//             assert.fail("Voted on a closed topic");
//         } catch (error) {
//             assert.include(error.message, "Topic is closed", "Unexpected error message");
//         }
//     });

//     it("should not allow voting multiple times on the same topic", async () => {
//         try {
//             await govChainInstance.vote(1, false, { from: accounts[1] });
//             assert.fail("Voted multiple times on the same topic");
//         } catch (error) {
//             assert.include(error.message, "Topic is closed", "Unexpected error message");
//         }
//     });

//     it("should automatically close a topic after the specified time has passed", async () => {
//         const description = "Discuss urgent matter";
//         await govChainInstance.createTopic(description, 1, [accounts[1]], { from: accounts[0] });
//         let topic = await govChainInstance.getTopicDetails(2);
//         assert.isTrue(topic.isOpen, "Topic should be open before voting");
//         // Wait for the discussion period to pass (more than 1 hour)
//         await timeMachine.advanceTime(4800);

//         // Try to vote after the discussion period has ended
//         try {
//             await govChainInstance.vote(2, true, { from: accounts[1] });
//             assert.fail("Voted after the discussion period should have ended");
//         } catch (error) {
//             // Verify that the error message matches the expected revert reason
//             assert.include(error.message, "Discussion period for this topic has ended. Topic closed automatically.", "Unexpected error message");
//         }

//         // // Verify that the topic is closed automatically
//         // topic = await govChainInstance.getTopicDetails(2);
//         // assert.isFalse(topic.isOpen, "Topic was not closed automatically after the discussion period");
//     });


// });
