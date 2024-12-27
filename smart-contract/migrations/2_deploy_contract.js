const GovChain = artifacts.require("GovChain");

module.exports = function (deployer) {
    deployer.deploy(GovChain);
};