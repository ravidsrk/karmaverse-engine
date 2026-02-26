/**
 * Content index — merges original seed data with expanded content.
 * Re-exports everything tools need.
 *
 * Counts: ~52 Gita + ~41 Stoic + ~27 Buddhist + ~17 Yoga = ~137 verses
 *         + 94 affirmations + 16 meditations + 6 breathwork + 12 biases = ~265 items
 */

export type {
  WisdomVerse,
  BreathworkExercise,
  Affirmation,
  MeditationTemplate,
} from "./wisdom";

import {
  wisdomVerses as originalVerses,
  breathworkExercises,
  affirmations as originalAffirmations,
  meditationTemplates as originalMeditations,
} from "./wisdom";
import { gitaExpanded } from "./verses-gita-expanded";
import { stoicExpanded } from "./verses-stoic-expanded";
import { buddhistExpanded } from "./verses-buddhist-expanded";
import { yogaExpanded } from "./verses-yoga-expanded";
import { affirmationsExpanded } from "./affirmations-expanded";
import { meditationsExpanded } from "./meditations-expanded";

// Deduplicate by id (expanded versions take priority if id conflicts)
function dedup<T extends { id: string }>(original: T[], expanded: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  // Expanded first (takes priority)
  for (const item of expanded) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  // Then original
  for (const item of original) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

/** All wisdom verses across 4 traditions */
export const wisdomVerses = dedup(
  originalVerses,
  [...gitaExpanded, ...stoicExpanded, ...buddhistExpanded, ...yogaExpanded]
);

/** All affirmations across 8 categories */
export const affirmations = dedup(originalAffirmations, affirmationsExpanded);

/** All meditation templates */
export const meditationTemplates = dedup(originalMeditations, meditationsExpanded);

/** Breathwork exercises (no expansion needed — already at 6, spec target) */
export { breathworkExercises } from "./wisdom";

/** Cognitive biases */
export { cognitiveBiases } from "./biases";
export type { CognitiveBias } from "./biases";

// Content stats (logged at import time in dev)
if (process.env.NODE_ENV === "development") {
  console.log(
    `[KarmaVerse Content] ${wisdomVerses.length} verses, ${affirmations.length} affirmations, ${meditationTemplates.length} meditations, ${breathworkExercises.length} breathwork`
  );
}
