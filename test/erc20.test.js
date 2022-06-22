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
  const spender = accounts[2];

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

    let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(
      recipient
    );

    let amount = new BN(10);

    await this.ERC20Instance.transfer(recipient, amount, { from: owner });

    let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);

    let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(
      recipient
    );

    console.log(
      "balance Owner Before Transfer =>",
      balanceOwnerBeforeTransfer.toString()
    );

    console.log(
      "balance Recipient Before Transfer =>",
      balanceRecipientBeforeTransfer.toString()
    );

    console.log(
      "balance Owner After Transfer =>",
      balanceOwnerAfterTransfer.toString()
    );

    console.log(
      "balance Recipient After Transfer =>",
      balanceRecipientAfterTransfer.toString()
    );

    expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(
      balanceOwnerBeforeTransfer.sub(amount)
    );
    expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(
      balanceRecipientBeforeTransfer.add(amount)
    );
  });

  it("vérifie si l'approve est bien effectué", async function () {
    let allowanceSpenderBeforeApprove = await this.ERC20Instance.allowance(
      owner,
      spender
    );

    let amount = new BN(100);
    await this.ERC20Instance.approve(spender, amount, {
      from: owner,
    });

    let allowanceSpenderAfterApprove = await this.ERC20Instance.allowance(
      owner,
      spender
    );

    console.log(
      "allowance Spender Before Approve =>",
      allowanceSpenderBeforeApprove.toString()
    );
    console.log(
      "allowance Spender After Approve =>",
      allowanceSpenderAfterApprove.toString()
    );

    expect(allowanceSpenderAfterApprove).to.be.bignumber.equal(
      allowanceSpenderBeforeApprove.add(amount)
    );
  });

  it("vérifie si transferFrom est ok après approve", async function () {
    let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
    let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(
      recipient
    );
    let amount = new BN(10);

    await this.ERC20Instance.approve(spender, amount, { from: owner });
    await this.ERC20Instance.transferFrom(owner, recipient, amount, {
      from: spender,
    });

    let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
    let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(
      recipient
    );

    console.log(
      "balance Owner Before Transfer =>",
      balanceOwnerBeforeTransfer.toString()
    );
    console.log(
      "balance recipient Before Transfer =>",
      balanceRecipientBeforeTransfer.toString()
    );

    console.log(
      "balance Owner After Transfer =>",
      balanceOwnerAfterTransfer.toString()
    );
    console.log(
      "balance Recipient Before Transfer =>",
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
