const ERC20Token = artifacts.require("ERC20Token");
const { BN } = require("@openzeppelin/test-helpers");

module.exports = async function (deployer, network, accounts) {
  console.log("network =>", network);
  console.log("accounts =>", accounts);

  const _initialsupply = new BN(1000);

  deployer.deploy(ERC20Token, _initialsupply);

  var instance = await ERC20Token.deployed();
  var balanceOfOwner = await instance.balanceOf(accounts[0]);

  console.log("balance Of Owner =>", balanceOfOwner.toString());
};
