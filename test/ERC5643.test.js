import { expect } from "chai";
import { network } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-ethers-chai-matchers/withArgs";
const { ethers, networkHelpers } = await network.connect();

const tokenId = 0;
const duration = 100;

async function getTimestamp(tx) {
  return (await ethers.provider.getBlock(tx.blockNumber)).timestamp;
}

describe("ERC-5643 Contract", async function () {

  async function deployFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const ERC5643 = await ethers.deployContract("Mock5643");
    await ERC5643.mint(owner.address);
    return { ERC5643, owner, addr1, addr2 };
  }

  describe("Subscriptions", function () {

    it("can renew", async function () {
      const { ERC5643, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      const tx = await ERC5643.renewSubscription(tokenId, duration);
      const expires = await getTimestamp(tx)+duration;
      expect(tx).to.emit(ERC5643, "SubscriptionUpdate").withArgs(tokenId, expires);
    });


    it("can get expires at", async function () {
      const { ERC5643, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      const tx = await ERC5643.renewSubscription(tokenId, duration);
      const expires = await getTimestamp(tx)+duration;
      const expires_ = await ERC5643.userExpires(tokenId);
      expect(expires_).to.equal(expires);    
    });

    it("can get renewable", async function () {
      const { ERC5643, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      const renewable = await ERC5643.isRenewable(tokenId);
      expect(renewable).to.equal(true);    
    });

    it("can cancel", async function () {
      const { ERC5643, owner, addr1 } = await networkHelpers.loadFixture(deployFixture);
      const tx = await ERC5643.cancelSubscription(tokenId);
      expect(tx).to.emit(ERC5643, "SubscriptionUpdate").withArgs(tokenId, 0);
    });

  });

});