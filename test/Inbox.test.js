const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { interface, bytecode } = require("../compile.js");

const web3 = new Web3(ganache.provider());

let accounts;
let inbox;

beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // use some of these acconts
  // to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["Hi There!"],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox Contract", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hi There!");
  });

  it("can change the message", async () => {
    await inbox.methods
      .setMessage("Bye")
      .send({ from: accounts[0], gas: "1000000" });
    const message = await inbox.methods.message().call();
    assert.equal(message, "Bye");
  });
});
