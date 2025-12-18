import { expect } from "chai";
import { network } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-ethers-chai-matchers/withArgs";
const { ethers, networkHelpers } = await network.connect();

const expires = Date.now()+(60*60*24*1);
const tokenId = 0;
const duration = 100;

describe("ERC-4885 Contract", async function () {

  async function deployFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    // const ERC4805 = await ethers.deployContract("Mock4805");
    // await ERC4805.mint(owner.address);
    // return { ERC4805, owner, addr1, addr2 };
  }

  describe("Subscriptions", function () {


  });

});