import { expect } from "chai";
import { cal } from "../../src/oneProportion/calculation";

describe("One Proportion Generate Labels", () => {
  it("Generate labels for 1 toss", () => {
    const noOfCoin = 1;
    expect(cal.generateLabels(noOfCoin)).to.eql([0, 1]);
  });
  it("Generate labels for 5 tosses", () => {
    const noOfCoin = 5;
    expect(cal.generateLabels(noOfCoin)).to.eql([0, 1, 2, 3, 4, 5]);
  });
});

describe("One Proportion Calcultae Binonimal For One", () => {
  it("Generate probability base for 5 toss", () => {
    const noOfCoin = 5;
    const probability = 0.5;
    expect(cal.calculateBinonimalForOne(noOfCoin, probability)).to.eql([
      0.0315,
      0.156,
      0.3125,
      0.3125,
      0.15625,
      0.03125
    ]);
  });
});

describe("One Proportion Mean", () => {
  it("mean should be 0 if 0 heads", () => {
    const samples = [5, 0, 0, 0, 0, 0, 0];
    const res = 0;
    expect(cal.calculateMean(samples)).to.equal(res);
  });
  it("mean should be NAN if no sample", () => {
    const samples = [];
    expect(cal.calculateMean(samples)).to.be.NaN;
  });
});

describe("One Proportion STD", () => {
  it("mean should be 0 if 0 heads", () => {
    const samples = [5, 0, 0, 0, 0, 0, 0];
    const res = 0;
    expect(cal.calucalteStd(samples)).to.equal(res);
  });
  it("mean should be NAN if no sample", () => {
    const samples = [];
    expect(cal.calucalteStd(samples)).to.be.NaN;
  });
});

describe("One Proportion Draw Samples", () => {
  it("All heads if probability is 1", () => {
    const probability = 1;
    const noOfCoin = 5;
    const noOfDraw = 2;
    expect(cal.drawSamples(probability, noOfCoin, noOfDraw)).to.eql([
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ]);
  });
  it("All heads if probability is 0", () => {
    const probability = 0;
    const noOfCoin = 5;
    const noOfDraw = 2;
    expect(cal.drawSamples(probability, noOfCoin, noOfDraw)).to.eql([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]);
  });
});
