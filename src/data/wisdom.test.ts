import { describe, it, expect } from "vitest";
import {
  wisdomVerses,
  breathworkExercises,
  affirmations,
  meditationTemplates,
} from "./wisdom";

describe("Wisdom Data", () => {
  describe("wisdomVerses", () => {
    it("has verses from all 4 traditions", () => {
      const traditions = new Set(wisdomVerses.map((v) => v.tradition));
      expect(traditions).toContain("gita");
      expect(traditions).toContain("stoic");
      expect(traditions).toContain("buddhist");
      expect(traditions).toContain("yoga_sutras");
    });

    it("has at least 20 verses total", () => {
      expect(wisdomVerses.length).toBeGreaterThanOrEqual(20);
    });

    it("every verse has required fields", () => {
      for (const v of wisdomVerses) {
        expect(v.id).toBeTruthy();
        expect(v.tradition).toBeTruthy();
        expect(v.source).toBeTruthy();
        expect(v.reference).toBeTruthy();
        expect(v.text.length).toBeGreaterThan(10);
        expect(v.interpretation.length).toBeGreaterThan(10);
        expect(v.themes.length).toBeGreaterThan(0);
        expect(v.moodTags.length).toBeGreaterThan(0);
      }
    });

    it("has unique IDs", () => {
      const ids = wisdomVerses.map((v) => v.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("breathworkExercises", () => {
    it("has at least 5 exercises", () => {
      expect(breathworkExercises.length).toBeGreaterThanOrEqual(5);
    });

    it("every exercise has steps with durations", () => {
      for (const e of breathworkExercises) {
        expect(e.name).toBeTruthy();
        expect(e.slug).toBeTruthy();
        expect(e.steps.length).toBeGreaterThan(0);
        expect(e.totalDurationSeconds).toBeGreaterThan(0);
        for (const step of e.steps) {
          expect(step.instruction).toBeTruthy();
          expect(step.durationSeconds).toBeGreaterThan(0);
          expect(step.phase).toBeTruthy();
        }
      }
    });

    it("has beginner exercises", () => {
      const beginner = breathworkExercises.filter((e) => e.difficulty === "beginner");
      expect(beginner.length).toBeGreaterThanOrEqual(3);
    });

    it("has unique slugs", () => {
      const slugs = breathworkExercises.map((e) => e.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });
  });

  describe("affirmations", () => {
    it("has at least 10 affirmations", () => {
      expect(affirmations.length).toBeGreaterThanOrEqual(10);
    });

    it("covers multiple categories", () => {
      const categories = new Set(affirmations.map((a) => a.category));
      expect(categories.size).toBeGreaterThanOrEqual(5);
    });

    it("every affirmation has mood tags", () => {
      for (const a of affirmations) {
        expect(a.text.length).toBeGreaterThan(5);
        expect(a.moodTags.length).toBeGreaterThan(0);
        expect(a.tradition).toBeTruthy();
      }
    });
  });

  describe("meditationTemplates", () => {
    it("has at least 4 templates", () => {
      expect(meditationTemplates.length).toBeGreaterThanOrEqual(4);
    });

    it("every template has a script", () => {
      for (const t of meditationTemplates) {
        expect(t.name).toBeTruthy();
        expect(t.script.length).toBeGreaterThan(50);
        expect(t.durationMinutes).toBeGreaterThan(0);
        expect(t.moodTags.length).toBeGreaterThan(0);
      }
    });

    it("covers different categories", () => {
      const categories = new Set(meditationTemplates.map((t) => t.category));
      expect(categories.size).toBeGreaterThanOrEqual(3);
    });
  });
});
