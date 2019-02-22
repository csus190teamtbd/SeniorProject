import { expect } from "chai";
import { cal } from "../../src/oneProportion/calculation";

describe("One Proportion Generate Labels", () => {
  it("Generate labels for 1 toss", () => {
    const noOfCoin = 1;
    const res = [0, 1];
    expect(cal.generateLabels(noOfCoin)).to.eql(res);
  });
  it("Generate labels for 5 tosses", () => {
    const noOfCoin = 5;
    const res = [0, 1, 2, 3, 4, 5];
    expect(cal.generateLabels(noOfCoin)).to.eql(res);
  });
});

describe("One Proportion Calcultae Binonimal For One", () => {
  it("Generate probability base for 5 toss", () => {
    const noOfCoin = 5;
    const probability = 0.5;
    const res = [0.03125, 0.15625, 0.3125, 0.3125, 0.15625, 0.03125];
    expect(cal.calculateBinonimalForOne(noOfCoin, probability)).to.eql(res);
  });
});

describe("One Proportion Draw Samples", () => {
  it("All heads if probability is 1", () => {
    const probability = 1;
    const noOfCoin = 5;
    const noOfDraw = 2;
    const res = [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1]];
    expect(cal.drawSamples(probability, noOfCoin, noOfDraw)).to.eql(res);
  });
  it("All heads if probability is 0", () => {
    const probability = 0;
    const noOfCoin = 5;
    const noOfDraw = 2;
    const res = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    expect(cal.drawSamples(probability, noOfCoin, noOfDraw)).to.eql(res);
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
  it("STD should be 0 if 0 heads", () => {
    const samples = [5, 0, 0, 0, 0, 0, 0];
    const res = 0;
    expect(cal.calucalteStd(samples)).to.equal(res);
  });
  it("STD should be NAN if no sample", () => {
    const samples = [];
    expect(cal.calucalteStd(samples)).to.be.NaN;
  });
});

describe("One Proportion Calculate Samples Selected", () => {
  it("should return no of selected samples when (0 <= lower < upper <= sample.length)", () => {
    const lower = 2;
    const upper = 3;
    const samples = [1, 2, 3, 4, 5, 6, 7];
    const res = 7;
    expect(cal.calculateSamplesSelected(lower, upper, samples)).to.equal(res);
  });
  it("should return no of selected sample when (0 <= lower == upper <= sample.length)", () => {
    const lower = 3;
    const upper = 3;
    const samples = [1, 2, 3, 4, 5, 6, 7];
    const res = 4;
    expect(cal.calculateSamplesSelected(lower, upper, samples)).to.equal(res);
  });
  it("should return 0 when (0 <= upper < lower <= sample.length)", () => {
    const lower = 4;
    const upper = 3;
    const samples = [1, 2, 3, 4, 5, 6, 7];
    const res = 0;
    expect(cal.calculateSamplesSelected(lower, upper, samples)).to.equal(res);
  });
  it("should return no of all samples when (lower < 0 < sample.length < upper)", () => {
    const lower = -1;
    const upper = 7;
    const samples = [1, 2, 3, 4, 5, 6, 7];
    const res = 28;
    expect(cal.calculateSamplesSelected(lower, upper, samples)).to.equal(res);
  });
});

describe("One Proportion Generate Selected Array", () => {
  it("should return Array for Selected Samples", () => {
    const lower = 2;
    const upper = 3;
    const noOfCoin = 5;
    const res = [NaN, NaN, 0, 0, 0, NaN, NaN];
    expect(cal.generateSelectedArray(lower, upper, noOfCoin)).to.eql(res);
  });
});

describe("One Proportion Add Samples", () => {
  it("should return updated samples after add samples", () => {
    const originalSamples = [1, 2, 3, 4, 5, 6];
    const drawResults = [
      [0, 0, 0, 1, 1], // total heads 2
      [0, 1, 0, 1, 1], // total heads 3
      [0, 0, 1, 1, 1], // total heads 3
      [1, 0, 0, 1, 1] // total heads 3
    ];
    const res = [1, 2, 4, 7, 5, 6];
    expect(cal.addSamples(originalSamples, drawResults)).to.eql(res);
  });
});
