import { expect } from "chai";
import { network } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-ethers-chai-matchers/withArgs";
const { ethers, networkHelpers } = await network.connect();

describe("ERC-6932 Contract", async function () {

  async function deployFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    // const ERC20 = await ethers.deployContract("MockERC20");
    // const ERC6932 = await ethers.deployContract("ERC6932");
    // await ERC20.mint(owner.address);
    // return { ERC6932, owner, addr1, addr2 };
  }

  describe("Subscriptions", function () {

  });

});