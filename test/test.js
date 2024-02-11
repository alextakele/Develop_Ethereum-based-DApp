const { expect } = require("chai");

describe("Refund Contract", function () {
  let refundContract;

  beforeEach(async function () {
    const RefundFactory = await ethers.getContractFactory("refundByLocation");
    refundContract = await RefundFactory.deploy();
    await refundContract.deployed();
  });

  it("Should add an employee, check location, and pay if valid", async function () {
    const employeeAddress = "0x123"; 
    // Add employee and check location
    await refundContract.addEmployee(employeeAddress, 123, 456, 789, 100);
    const contractInfo = await refundContract.contractInfo(employeeAddress);

    expect(contractInfo.center_lat).to.equal(123);
    expect(contractInfo.center_lon).to.equal(456);
    expect(contractInfo.radius).to.equal(789);
    expect(contractInfo.budget).to.equal(100);

    await refundContract.checkLocation(123, 456);
    const updatedContractInfo = await refundContract.contractInfo(employeeAddress);

    expect(updatedContractInfo.status).to.equal(true); 
    // Pay employee if location is valid
    const initialBalance = await ethers.provider.getBalance(employeeAddress);
    await refundContract.pay(employeeAddress);
    const finalBalance = await ethers.provider.getBalance(employeeAddress);

    expect(finalBalance).to.be.above(initialBalance);
  });
});
