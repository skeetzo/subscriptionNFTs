import { expect } from "chai";
import { network } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-ethers-chai-matchers/withArgs";
const { ethers, networkHelpers } = await network.connect();

const expires = Date.now()+(60*60*24*1);
const tokenId = 0;
const duration = 100;

describe("ERC-948 Contract", async function () {

  async function deployFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    // const ERC948 = await ethers.deployContract("Mock948");
    // await ERC948.mint(owner.address);
    // return { ERC4907, owner, addr1, addr2 };
  }

  describe("Subscriptions", function () {


  });

});