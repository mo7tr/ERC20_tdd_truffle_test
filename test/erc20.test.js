const { BN } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const ERC20 = artifacts.require("ERC20Token");

contract("ERC20", function (accounts) {
  const _name = "PARIS SAINT-GERMAIN";
  const _symbol = "PSG";

  const _initialsupply = new BN(1000);
  console.log("_initialsupply =>", _initialsupply);

  const _decimals = new BN(18);

  const owner = accounts[0];
  console.log("owner =>", owner);

  const recipient = accounts[1];

  beforeEach(async function () {
    this.ERC20Instance = await ERC20.new(_initialsupply, { from: owner });
    //console.log("this.ERC20Instance =>", this.ERC20Instance);
  });

  it("a un nom", async function () {
    expect(await this.ERC20Instance.name()).to.equal(_name);
  });

  it("a un symbole", async function () {
    expect(await this.ERC20Instance.symbol()).to.equal(_symbol);
  });

  it("a une valeur décimal", async function () {
    expect(await this.ERC20Instance.decimals()).to.be.bignumber.equal(
      _decimals
    );
  });

  it("vérifie la balance du propriétaire du contrat", async function () {
    let balanceOwner = await this.ERC20Instance.balanceOf(owner);
    let totalSupply = await this.ERC20Instance.totalSupply();
    expect(balanceOwner).to.be.bignumber.equal(totalSupply);
  });

  it("vérifie si un transfer est bien effectué", async function () {
    let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
    console.log(
      "balanceOwnerBeforeTransfer =>",
      balanceOwnerBeforeTransfer.toString()
    );

    let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(
      recipient
    );
    console.log(
      "balanceRecipientBeforeTransfer =>",
      balanceRecipientBeforeTransfer.toString()
    );

    let amount = new BN(10);

    await this.ERC20Instance.transfer(recipient, amount, { from: owner });

    let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
    console.log(
      "balanceOwnerAfterTransfer =>",
      balanceOwnerAfterTransfer.toString()
    );

    let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(
      recipient
    );
    console.log(
      "balanceRecipientAfterTransfer =>",
      balanceRecipientAfterTransfer.toString()
    );

    expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(
      balanceOwnerBeforeTransfer.sub(amount)
    );
    expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(
      balanceRecipientBeforeTransfer.add(amount)
    );
  });
});