import { getScoreTone } from "../../src/components/ats/ATSScoreGauge";

describe("ATS Resume Intelligence Engine (TC-ATS-001, TC-ATS-002, TC-ATS-004)", () => {
  describe("Score Tone Classification & Visual Thresholds", () => {
    it("should classify scores >= 80 as Strong Compatibility (Emerald Green)", () => {
      const tone80 = getScoreTone(80);
      expect(tone80.label).toBe("Strong Compatibility");
      expect(tone80.badge).toBe("Excellent");
      expect(tone80.borderColor).toBe("#10B981");
      expect(tone80.textColor).toBe("#047857");

      const tone100 = getScoreTone(100);
      expect(tone100.label).toBe("Strong Compatibility");
      expect(tone100.badge).toBe("Excellent");
    });

    it("should classify scores between 60 and 79 as Moderate Compatibility (Amber Yellow)", () => {
      const tone60 = getScoreTone(60);
      expect(tone60.label).toBe("Moderate Compatibility");
      expect(tone60.badge).toBe("Good");
      expect(tone60.borderColor).toBe("#F59E0B");
      expect(tone60.textColor).toBe("#B45309");

      const tone75 = getScoreTone(75);
      expect(tone75.label).toBe("Moderate Compatibility");
      expect(tone75.badge).toBe("Good");

      const tone79 = getScoreTone(79);
      expect(tone79.label).toBe("Moderate Compatibility");
      expect(tone79.badge).toBe("Good");
    });

    it("should classify scores < 60 as Needs Optimization (Crimson Red)", () => {
      const tone59 = getScoreTone(59);
      expect(tone59.label).toBe("Needs Optimization");
      expect(tone59.badge).toBe("Action Needed");
      expect(tone59.borderColor).toBe("#EF4444");
      expect(tone59.textColor).toBe("#B91C1C");

      const tone20 = getScoreTone(20);
      expect(tone20.label).toBe("Needs Optimization");
      expect(tone20.badge).toBe("Action Needed");

      const tone0 = getScoreTone(0);
      expect(tone0.label).toBe("Needs Optimization");
      expect(tone0.badge).toBe("Action Needed");
    });
  });

  describe("Score Clamping and Boundary Precision", () => {
    it("should clamp negative scores to 0", () => {
      const toneNegative = getScoreTone(-25);
      expect(toneNegative.label).toBe("Needs Optimization");
      expect(toneNegative.badge).toBe("Action Needed");
    });

    it("should clamp scores exceeding 100 to 100", () => {
      const toneOver = getScoreTone(135);
      expect(toneOver.label).toBe("Strong Compatibility");
      expect(toneOver.badge).toBe("Excellent");
    });

    it("should round fractional scores accurately", () => {
      // 79.6 rounds to 80 -> Strong
      const toneNearUpper = getScoreTone(79.6);
      expect(toneNearUpper.label).toBe("Strong Compatibility");

      // 59.4 rounds to 59 -> Needs Optimization
      const toneNearLower = getScoreTone(59.4);
      expect(toneNearLower.label).toBe("Needs Optimization");

      // 59.6 rounds to 60 -> Moderate
      const toneCrossBoundary = getScoreTone(59.6);
      expect(toneCrossBoundary.label).toBe("Moderate Compatibility");
    });
  });
});
