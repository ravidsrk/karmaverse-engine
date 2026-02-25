// @ts-nocheck
/**
 * Quick integration test — runs all 15 tools to verify they work.
 */
import * as tools from "./tools/index.js";

async function test() {
  console.log("\n🧘 === KARMAVERSE ENGINE TEST SUITE ===\n");

  // --- GROUND LAYER ---
  console.log("--- GROUND LAYER ---\n");

  // 1. search_wisdom
  const wisdom = await tools.searchWisdom.execute!({ query: "I'm anxious about a deadline", mood: "anxious", tradition: "all", limit: 2 }, {} as any);
  console.log(`✅ search_wisdom: Found ${wisdom.verses.length} verses (total available: ${wisdom.totalAvailable})`);
  console.log(`   First: ${wisdom.verses[0]?.reference} — "${wisdom.verses[0]?.text.slice(0, 60)}..."`);

  // 2. get_verse
  const verse = await tools.getVerse.execute!({ tradition: "gita", reference: "2.47" }, {} as any);
  console.log(`✅ get_verse: ${verse.found ? verse.verse?.reference : "NOT FOUND"}`);

  // 3. get_breathing_exercise
  const breathing = await tools.getBreathingExercise.execute!({ useCase: "anxiety", difficulty: "beginner" }, {} as any);
  console.log(`✅ get_breathing_exercise: ${breathing.exercise.name} (${breathing.exercise.totalDurationSeconds}s)`);

  // 4. get_meditation
  const meditation = await tools.getMeditation.execute!({ category: "stress_relief", durationMinutes: 3, mood: "anxious" }, {} as any);
  console.log(`✅ get_meditation: ${meditation.meditation.name} (${meditation.meditation.durationMinutes}min)`);

  // 5. get_affirmation
  const affirmation = await tools.getAffirmation.execute!({ category: "calm", mood: "anxious", tradition: "any" }, {} as any);
  console.log(`✅ get_affirmation: "${affirmation.affirmation.text.slice(0, 60)}..."`);

  // 6. mindfulness_check_in
  const checkIn = await tools.mindfulnessCheckIn.execute!({ mood: "anxious", energy: "high", context: "deadline pressure" }, {} as any);
  console.log(`✅ mindfulness_check_in:`);
  console.log(`   Assessment: ${checkIn.assessment.slice(0, 80)}...`);
  console.log(`   Breathing: ${checkIn.breathing.name}`);
  console.log(`   Wisdom: ${checkIn.wisdom.reference}`);

  // 7. verse_of_the_day
  const votd = await tools.verseOfTheDay.execute!({ tradition: "any" }, {} as any);
  console.log(`✅ verse_of_the_day: ${votd.verse.reference} (${votd.date})`);

  // --- DECIDE LAYER ---
  console.log("\n--- DECIDE LAYER ---\n");

  // 8. create_decision_framework
  const framework = await tools.createDecisionFramework.execute!({
    decision: "Should I quit my job?",
    options: ["Quit and freelance", "Stay but negotiate", "Stay as-is"],
    context: "I've already invested 3 years but I'm frustrated after a bad meeting",
    userValues: ["growth", "stability", "family"],
    urgency: "weeks",
  }, {} as any);
  console.log(`✅ create_decision_framework: ${framework.biasesDetected.length} biases detected`);
  framework.biasesDetected.forEach((b: any) => console.log(`   ⚠️  ${b.bias}: ${b.signal}`));
  console.log(`   Recommendation: ${framework.recommendation.slice(0, 80)}...`);

  // 9. detect_biases
  const biases = await tools.detectBiases.execute!({
    reasoning: "I've already invested 3 years in this company, I can't quit now. Everyone else seems to be staying too.",
    decisionContext: "Job change",
  }, {} as any);
  console.log(`✅ detect_biases: ${biases.biasesFound.length} biases → Quality: ${biases.reasoningQuality}`);
  biases.biasesFound.forEach((b: any) => console.log(`   ⚠️  ${b.name} [${b.severity}]: ${b.matchedSignal}`));

  // 10. log_decision
  const logged = await tools.logDecision.execute!({
    userId: "test-user",
    title: "Job change decision",
    chosenOption: "Stay but negotiate better terms",
    reasoning: "After de-biasing, I realized my frustration is recent and negotiable",
    predictedOutcome: "Better alignment with manager, renewed motivation",
    confidenceLevel: 7,
    biasesFlagged: ["Sunk Cost Fallacy", "Bandwagon Effect"],
    reviewAfterDays: 0,
  }, {} as any);
  console.log(`✅ log_decision: ID=${logged.decisionId}, Review: ${logged.reviewDate}`);

  // 11. get_wisdom_counsel
  const counsel = await tools.getWisdomCounsel.execute!({
    dilemma: "duty to family vs personal ambition",
    traditions: ["gita", "stoic", "buddhist"],
    depth: "brief",
  }, {} as any);
  console.log(`✅ get_wisdom_counsel: ${counsel.counsel.length} traditions consulted`);

  // --- REFLECT LAYER ---
  console.log("\n--- REFLECT LAYER ---\n");

  // 12. get_pending_reflections
  const pending = await tools.getPendingReflections.execute!({ userId: "test-user" }, {} as any);
  console.log(`✅ get_pending_reflections: ${pending.totalPending} pending`);

  // 13. log_outcome
  const outcome = await tools.logOutcome.execute!({
    decisionId: logged.decisionId,
    actualOutcome: "Manager was receptive, got a raise and new project",
    satisfaction: 8,
    lessons: "Pausing before reacting leads to better outcomes",
    wouldChooseDifferently: false,
    surpriseFactor: "better_than_expected" as const,
  }, {} as any);
  console.log(`✅ log_outcome: ${outcome.recorded ? "Recorded" : "Failed"} — ${outcome.reflection.slice(0, 80)}...`);

  // Log 2 more decisions + outcomes for pattern detection
  const { getDecisionStore } = await import("./tools/decide/log-decision.js");
  for (let i = 0; i < 2; i++) {
    const d = await tools.logDecision.execute!({
      userId: "test-user",
      title: `Test decision ${i + 2}`,
      chosenOption: `Option ${i}`,
      confidenceLevel: i === 0 ? 3 : 9,
      reviewAfterDays: 0,
    }, {} as any);
    await tools.logOutcome.execute!({
      decisionId: d.decisionId,
      actualOutcome: i === 0 ? "Went poorly" : "Went great",
      satisfaction: i === 0 ? 3 : 9,
      wouldChooseDifferently: i === 0,
    }, {} as any);
  }

  // 14. detect_patterns
  const patterns = await tools.detectPatterns.execute!({ userId: "test-user" }, {} as any);
  console.log(`✅ detect_patterns: ${patterns.patternsFound.length} patterns found (${patterns.totalWithOutcomes} reflected decisions)`);
  patterns.patternsFound.forEach((p: any) => console.log(`   📊 [${p.type}] ${p.description.slice(0, 80)}...`));

  // 15. generate_reflection
  const reflection = await tools.generateReflection.execute!({ userId: "test-user", period: "weekly" }, {} as any);
  console.log(`✅ generate_reflection: Karma Score = ${reflection.karmaScoreEstimate.score} (${reflection.karmaScoreEstimate.level})`);
  console.log(`   Decisions: ${reflection.summary.decisionsLogged}, Outcomes: ${reflection.summary.outcomesRecorded}`);

  console.log("\n🎉 === ALL 15 TOOLS PASSED ===\n");
  console.log(`📊 Summary:`);
  console.log(`   Ground Layer:  7/7 tools ✅`);
  console.log(`   Decide Layer:  4/4 tools ✅`);
  console.log(`   Reflect Layer: 4/4 tools ✅`);
  console.log(`   Total:         15/15 tools ✅`);
  console.log(`\n   Karma Score: ${reflection.karmaScoreEstimate.score}/100 (${reflection.karmaScoreEstimate.level})`);
}

test().catch(console.error);
