import { expect } from "chai";
import { network } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-ethers-chai-matchers/withArgs";
const { ethers, networkHelpers } = await network.connect();

const expires = Date.now()+(60*60*24*1);
const tokenId = 0;
const duration = 100;

const amountRecurring = 1, amountInitial = 1, periodType = 0, periodMultiplier = 1, startTime = Date.now()+(60*60*24*1), data = "";
const amount = 1;

async function getTimestamp(tx) {
  return (await ethers.provider.getBlock(tx.blockNumber)).timestamp;
}

describe("ERC-948 Contract", async function () {

  let subscriptionId;

  async function deployFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const ERC948 = await ethers.deployContract("Mock948");
    const ERC20 = await ethers.deployContract("BasicToken");
    await ERC20.mint(owner.address, 100);
    return { ERC948, ERC20, owner, addr1, addr2 };
  }

  describe("Subscriptions", function () {

    it("can create subscription", async function () {
      const { ERC948, ERC20, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      await ERC20.approve(addr1.address, amountInitial+amountRecurring)
      const tx = await ERC948.createSubscription(addr1.address, ERC20.target, amountRecurring, amountInitial, periodType, periodMultiplier, startTime, data);
      const timestamp = await getTimestamp(tx);
      subscriptionId = ethers.utils.solidityPack(["address", "uint256"], [owner.address, timestamp])
      expect(tx).to.emit(ERC948, "NewSubscription").withArgs(subscriptionId, addr1.address, ERC20.target, amountRecurring, amountInitial, periodType, periodMultiplier, startTime);
    });

    it("can get subscribers subscriptions", async function () {
      const { ERC948, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      const subscriptions = await ERC948.getSubscribersSubscriptions(owner.address);
      // subscriptionId = 
      // owner.address + timestamp
      expect(subscriptions).to.deep.equal([subscriptionId]);
    });


    it("can cancel subscription", async function () {
      const { ERC948, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      const canceled = await ERC948.cancelSubscription(subscriptionId)
      expect(canceled).to.be.true;
    });

    it("can get payment due", async function () {
      const { ERC948, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      const isDue = await ERC948.paymentDue(subscriptionId);
      expect(isDue).to.be.false;
      // increase time
      expect(isDue).to.be.true;
    });

    it("can process subscription", async function () {
      const { ERC948, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      const processed = await ERC948.processSubscription(subscriptionId, amount);
      expect(processed).to.be.true;

    });








  });

});