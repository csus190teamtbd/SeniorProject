import { expect } from "chai";
import { cal } from "../../src/oneProportion/calculation";

describe("one proortion calculatoin", () => {
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
