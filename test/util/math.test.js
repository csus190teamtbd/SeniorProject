import * as MathUtil from "../../src/util/math.js";
import { expect } from "chai";

describe("MathUtil", function() {
  describe("#mean", function() {
    it("should be NaN for empty iterables", function() {
      expect(MathUtil.mean([])).to.be.NaN;

      function emptyIterable() {
        this[Symbol.iterator] = function() {
          return {
            next: () => {
              return { value: undefined, done: true };
            }
          };
        };
      }
      expect(MathUtil.mean(new emptyIterable())).to.be.NaN;
    });
    it("should have the correct value", function() {
      expect(MathUtil.mean([-1, 0, 1])).to.equal(0);
      expect(MathUtil.mean([0, 2, 1])).to.equal(1);
      expect(MathUtil.mean([0, 1])).to.equal(0.5);
      expect(
        Math.floor(1000 * MathUtil.mean([1, 48, 41, 93, 82, 22]))
      ).to.equal(47833);
    });
  });
  describe("#roundToPlaces", function() {
    it("should floor if next digit low", function() {
      expect(MathUtil.roundToPlaces(16.0, 0)).to.equal(16.0);
      expect(MathUtil.roundToPlaces(16.1, 1)).to.equal(16.1);
      expect(MathUtil.roundToPlaces(12.021, 2)).to.equal(12.02);
      expect(MathUtil.roundToPlaces(42.0032, 3)).to.equal(42.003);
      expect(MathUtil.roundToPlaces(47.00043, 4)).to.equal(47.0004);
      expect(MathUtil.roundToPlaces(47.000044, 5)).to.equal(47.00004);
    });
    it("should ceil if next digit high", function() {
      expect(MathUtil.roundToPlaces(16.9, 0)).to.equal(17.0);
      expect(MathUtil.roundToPlaces(16.15, 1)).to.equal(16.2);
      expect(MathUtil.roundToPlaces(12.026, 2)).to.equal(12.03);
      expect(MathUtil.roundToPlaces(42.0037, 3)).to.equal(42.004);
      expect(MathUtil.roundToPlaces(47.00048, 4)).to.equal(47.0005);
      expect(MathUtil.roundToPlaces(47.000049, 5)).to.equal(47.00005);
    });
    it("should cascade nines", function() {
      expect(MathUtil.roundToPlaces(999.9995, 3)).to.equal(1000.0);
    });
    it("should handle negatives correctly", function() {
      expect(MathUtil.roundToPlaces(-16.1, 1)).to.equal(-16.1);
      expect(MathUtil.roundToPlaces(-12.021, 2)).to.equal(-12.02);
      expect(MathUtil.roundToPlaces(-42.0032, 3)).to.equal(-42.003);
      expect(MathUtil.roundToPlaces(-47.00043, 4)).to.equal(-47.0004);
      expect(MathUtil.roundToPlaces(-47.000044, 5)).to.equal(-47.00004);
      expect(MathUtil.roundToPlaces(-16.9, 0)).to.equal(-17.0);
      expect(MathUtil.roundToPlaces(-16.15, 1)).to.equal(-16.1);
      expect(MathUtil.roundToPlaces(-12.026, 2)).to.equal(-12.03);
      expect(MathUtil.roundToPlaces(-42.0037, 3)).to.equal(-42.004);
      expect(MathUtil.roundToPlaces(-47.00048, 4)).to.equal(-47.0005);
      expect(MathUtil.roundToPlaces(-47.000049, 5)).to.equal(-47.00005);
    });
    it("should go the other way for negative places or something", function() {
      expect(MathUtil.roundToPlaces(1234.5678, 2)).to.equal(1234.57);
      expect(MathUtil.roundToPlaces(1234.5678, 1)).to.equal(1234.6);
      expect(MathUtil.roundToPlaces(1234.5678, 0)).to.equal(1235.0);
      expect(MathUtil.roundToPlaces(1234.5678, -1)).to.equal(1230.0);
      expect(MathUtil.roundToPlaces(1234.5678, -2)).to.equal(1200.0);
      expect(MathUtil.roundToPlaces(1234.5678, -3)).to.equal(1000.0);
      expect(MathUtil.roundToPlaces(1234.5678, -4)).to.equal(0.0);
    });
  });
  describe("#stddev", function() {
    it("should return correct results", function() {
      expect(MathUtil.stddev([95, 84, 70, 85, 91, 83, 89, 88])).to.equal(
        6.963072238602727
      );
    });
    it("should return NaN if sample size < 1", function() {
      expect(MathUtil.stddev([])).to.be.NaN;
    });
  });
  describe("#sampleStddev", function() {
    it("should return correct results", function() {
      expect(MathUtil.sampleStddev([95, 84, 70, 85, 91, 83, 89, 88])).to.equal(
        7.44383733605956
      );
    });
    it("should return NaN if sample size < 2", function() {
      expect(MathUtil.sampleStddev([])).to.be.NaN;
      expect(MathUtil.sampleStddev([1])).to.be.NaN;
    });
  });
});
