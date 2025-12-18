import { expect } from "chai";
import { network } from "hardhat";
// import { anyValue } from "@nomicfoundation/hardhat-ethers-chai-matchers/withArgs";
const { ethers, networkHelpers } = await network.connect();

const amountRecurring = 1, 
      amountInitial = 1, 
      periodType = 0, 
      periodMultiplier = 1, 
      startTime = Date.now()+(60*60*24*1), 
      data = "";

async function createSubscription(ERC20, ERC948, to, from) {
  await ERC20.approve(ERC948.target, amountInitial+amountRecurring)
  const tx = await ERC948.createSubscription(to, ERC20.target, amountRecurring, amountInitial, periodType, periodMultiplier, startTime, data);
  const timestamp = (await ethers.provider.getBlock(tx.blockNumber)).timestamp;
  // console.log("timestamp:", timestamp)
  const subscriptionId = ethers.solidityPackedKeccak256(["address", "uint256"], [from, timestamp]);
  // console.log("subscriptionId:", subscriptionId)
  return [subscriptionId, tx];
}

describe("ERC-948 Contract", async function () {

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
      const [subscriptionId, tx] = await createSubscription(ERC20, ERC948, addr1.address, owner.address);
      expect(tx).to.emit(ERC948, "NewSubscription").withArgs(subscriptionId, addr1.address, ERC20.target, amountRecurring, amountInitial, periodType, periodMultiplier, startTime);
    });

    it("can get subscribers subscriptions", async function () {
      const { ERC948, ERC20, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      let subscriptions = await ERC948.getSubscribersSubscriptions(owner.address);
      expect(subscriptions).to.deep.equal([]);
      const [subscriptionId,] = await createSubscription(ERC20, ERC948, addr1.address, owner.address);
      subscriptions = await ERC948.getSubscribersSubscriptions(owner.address);
      expect(subscriptions).to.deep.equal([subscriptionId]);
    });

    it("can cancel subscription", async function () {
      const { ERC948, ERC20, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      const [subscriptionId,] = await createSubscription(ERC20, ERC948, addr1.address, owner.address);
      const canceled = await ERC948.cancelSubscription.staticCall(subscriptionId);
      expect(canceled).to.be.true;
    });

    it("can get payment due", async function () {
      const { ERC948, ERC20, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      const [subscriptionId,] = await createSubscription(ERC20, ERC948, addr1.address, owner.address);
      let isDue = await ERC948.paymentDue(subscriptionId);
      expect(isDue).to.be.false;
      await networkHelpers.time.increase(periodMultiplier+1);
      isDue = await ERC948.paymentDue(subscriptionId);
      expect(isDue).to.be.true;
    });

    it("can process subscription", async function () {
      const { ERC948, ERC20, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      const [subscriptionId,] = await createSubscription(ERC20, ERC948, addr1.address, owner.address);
      await networkHelpers.time.increase(periodMultiplier+1);
      const processed = await ERC948.processSubscription.staticCall(subscriptionId, amountRecurring);
      expect(processed).to.be.true;
    });

  });

});