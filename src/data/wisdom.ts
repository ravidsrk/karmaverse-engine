/**
 * Curated wisdom content across 4 traditions.
 * This is the seed data — eventually backed by Supabase.
 */

export interface WisdomVerse {
  id: string;
  tradition: "gita" | "stoic" | "buddhist" | "yoga_sutras";
  source: string;
  reference: string;
  text: string;
  interpretation: string;
  themes: string[];
  moodTags: string[];
}

export const wisdomVerses: WisdomVerse[] = [
  // === BHAGAVAD GITA ===
  {
    id: "gita-2-47",
    tradition: "gita",
    source: "Bhagavad Gita",
    reference: "Chapter 2, Verse 47",
    text: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.",
    interpretation: "Focus on what you can control — your effort, your intention, your action. The outcome is not yours to command. This isn't passivity; it's the deepest form of engagement — doing your best without being enslaved by anxiety about results.",
    themes: ["non-attachment", "duty", "action", "control"],
    moodTags: ["anxious", "overwhelmed", "restless", "confused"],
  },
  {
    id: "gita-2-14",
    tradition: "gita",
    source: "Bhagavad Gita",
    reference: "Chapter 2, Verse 14",
    text: "O son of Kunti, the contact between the senses and their objects gives rise to fleeting perceptions of happiness and distress. These are non-permanent; they come and go. Bear them patiently.",
    interpretation: "Your feelings right now — whether pain or pleasure — are temporary visitors. They arrived, and they will leave. You don't need to fight them or cling to them. Just let them pass through.",
    themes: ["impermanence", "equanimity", "patience", "emotions"],
    moodTags: ["sad", "frustrated", "anxious", "angry"],
  },
  {
    id: "gita-3-35",
    tradition: "gita",
    source: "Bhagavad Gita",
    reference: "Chapter 3, Verse 35",
    text: "It is far better to perform one's own duty, however imperfectly, than to assume the duty of another person, however successfully. Destruction in the course of performing one's own duty is better than engaging in another's duty, for to follow another's path is dangerous.",
    interpretation: "Stop comparing your path to anyone else's. Your unique duty — your dharma — is yours alone. Even if you stumble on your own path, that's more authentic than perfectly walking someone else's.",
    themes: ["authenticity", "duty", "comparison", "purpose"],
    moodTags: ["confused", "envious", "restless", "hopeful"],
  },
  {
    id: "gita-6-5",
    tradition: "gita",
    source: "Bhagavad Gita",
    reference: "Chapter 6, Verse 5",
    text: "Elevate yourself through the power of your mind, and not degrade yourself, for the mind can be the friend and also the enemy of the self.",
    interpretation: "Your mind is either your greatest ally or your worst saboteur. Right now, which is it being? If it's attacking you with doubt or fear, recognize that — and choose to use it as a tool of elevation instead.",
    themes: ["mindset", "self-mastery", "discipline", "growth"],
    moodTags: ["hopeful", "restless", "confused", "anxious"],
  },
  {
    id: "gita-2-62",
    tradition: "gita",
    source: "Bhagavad Gita",
    reference: "Chapter 2, Verse 62",
    text: "While contemplating the objects of the senses, a person develops attachment for them, and from such attachment lust develops, and from lust anger arises.",
    interpretation: "Notice the chain: fixation → attachment → craving → frustration. When you find yourself obsessing over something, pause. The spiral hasn't started yet. You can step off.",
    themes: ["attachment", "awareness", "impulse", "mindfulness"],
    moodTags: ["restless", "angry", "anxious", "overwhelmed"],
  },
  {
    id: "gita-4-38",
    tradition: "gita",
    source: "Bhagavad Gita",
    reference: "Chapter 4, Verse 38",
    text: "In this world, there is nothing so sublime and pure as transcendental knowledge. Such knowledge is the mature fruit of all mysticism.",
    interpretation: "Self-knowledge is the ultimate reward. Not money, not status, not comfort — but understanding who you are and why you do what you do. Every reflection, every moment of clarity, is progress.",
    themes: ["knowledge", "wisdom", "growth", "purpose"],
    moodTags: ["hopeful", "grateful", "peaceful", "confused"],
  },
  {
    id: "gita-9-22",
    tradition: "gita",
    source: "Bhagavad Gita",
    reference: "Chapter 9, Verse 22",
    text: "To those who are constantly devoted and who worship Me with love, I give the understanding by which they can come to Me.",
    interpretation: "Consistent practice opens doors that sporadic effort never will. Whether it's meditation, reflection, or simply showing up every day — devotion to the process reveals understanding over time.",
    themes: ["devotion", "consistency", "practice", "faith"],
    moodTags: ["hopeful", "grateful", "peaceful"],
  },

  // === STOIC PHILOSOPHY ===
  {
    id: "stoic-epictetus-1",
    tradition: "stoic",
    source: "Epictetus, Enchiridion",
    reference: "Chapter 1",
    text: "Some things are within our power, while others are not. Within our power are opinion, motivation, desire, aversion, and, in a word, whatever is of our own doing. Not within our power are our body, our property, reputation, office, and, in a word, whatever is not of our own doing.",
    interpretation: "The fundamental Stoic insight: separate what you can control from what you can't. Your thoughts, choices, and responses — those are yours. Everything else? Let it go. This isn't defeat; it's clarity.",
    themes: ["control", "acceptance", "clarity", "freedom"],
    moodTags: ["anxious", "overwhelmed", "frustrated", "confused"],
  },
  {
    id: "stoic-marcus-4-3",
    tradition: "stoic",
    source: "Marcus Aurelius, Meditations",
    reference: "Book 4, Chapter 3",
    text: "People seek retreats for themselves — in the country, at the seashore, in the mountains. But this is altogether unphilosophical, when you can retreat into yourself at any time you want.",
    interpretation: "You don't need to escape your life to find peace. The retreat you're looking for is already inside you. Close your eyes, take a breath, and go there now.",
    themes: ["inner peace", "retreat", "mindfulness", "stillness"],
    moodTags: ["overwhelmed", "restless", "anxious", "lonely"],
  },
  {
    id: "stoic-marcus-8-47",
    tradition: "stoic",
    source: "Marcus Aurelius, Meditations",
    reference: "Book 8, Chapter 47",
    text: "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.",
    interpretation: "The event didn't hurt you — your interpretation of it did. And interpretations can be changed. Right now, can you see this situation differently? Not through denial, but through a wider lens?",
    themes: ["perception", "reframing", "control", "resilience"],
    moodTags: ["frustrated", "angry", "sad", "anxious"],
  },
  {
    id: "stoic-seneca-letters-13",
    tradition: "stoic",
    source: "Seneca, Letters to Lucilius",
    reference: "Letter 13",
    text: "We suffer more often in imagination than in reality.",
    interpretation: "Most of what you're afraid of hasn't happened yet — and may never happen. Your mind is running disaster simulations. Pause. Come back to what's actually real right now, in this moment.",
    themes: ["anxiety", "imagination", "present moment", "fear"],
    moodTags: ["anxious", "overwhelmed", "restless"],
  },
  {
    id: "stoic-seneca-brevity-1",
    tradition: "stoic",
    source: "Seneca, On the Shortness of Life",
    reference: "Chapter 1",
    text: "It is not that we have a short time to live, but that we waste a great deal of it. Life is long enough, and a sufficiently generous amount has been given to us for the highest achievements if it were all well invested.",
    interpretation: "You have enough time. The question isn't about more time — it's about where your attention goes. What are you spending your hours on? Does it align with what matters to you?",
    themes: ["time", "purpose", "focus", "intentionality"],
    moodTags: ["overwhelmed", "restless", "confused", "hopeful"],
  },
  {
    id: "stoic-epictetus-5",
    tradition: "stoic",
    source: "Epictetus, Enchiridion",
    reference: "Chapter 5",
    text: "It is not things that disturb us, but our judgments about things.",
    interpretation: "The meeting didn't ruin your day — your story about the meeting did. Can you separate the fact from the narrative? What actually happened, stripped of interpretation?",
    themes: ["perception", "judgment", "clarity", "equanimity"],
    moodTags: ["frustrated", "angry", "anxious", "sad"],
  },

  // === BUDDHIST WISDOM ===
  {
    id: "buddhist-dhp-1",
    tradition: "buddhist",
    source: "Dhammapada",
    reference: "Verse 1",
    text: "Mind is the forerunner of all actions. All deeds are led by mind, created by mind. If one speaks or acts with a corrupt mind, suffering follows, as the wheel follows the hoof of the ox.",
    interpretation: "Your state of mind shapes everything that follows. Before you act, check: what's driving this? Clarity or confusion? Calm or reactivity? The quality of the action depends on the quality of the mind behind it.",
    themes: ["mindfulness", "intention", "action", "awareness"],
    moodTags: ["confused", "restless", "angry", "anxious"],
  },
  {
    id: "buddhist-dhp-183",
    tradition: "buddhist",
    source: "Dhammapada",
    reference: "Verse 183",
    text: "To avoid all evil, to cultivate good, and to purify one's mind — this is the teaching of all the Buddhas.",
    interpretation: "The simplest instruction, and the hardest to follow: avoid harm, do good, keep your mind clear. That's it. Everything else is commentary.",
    themes: ["simplicity", "goodness", "clarity", "practice"],
    moodTags: ["hopeful", "peaceful", "confused"],
  },
  {
    id: "buddhist-4nt",
    tradition: "buddhist",
    source: "Pali Canon",
    reference: "Four Noble Truths",
    text: "There is suffering. There is the origin of suffering. There is the cessation of suffering. There is a path leading to the cessation of suffering.",
    interpretation: "Pain is real — don't deny it. But it has a cause, and that cause can be addressed. There is a way through this. The path exists. You're already on it by seeking understanding.",
    themes: ["suffering", "hope", "path", "healing"],
    moodTags: ["sad", "hopeless", "overwhelmed", "lonely"],
  },
  {
    id: "buddhist-thich-present",
    tradition: "buddhist",
    source: "Thich Nhat Hanh",
    reference: "The Miracle of Mindfulness",
    text: "The present moment is the only moment available to us, and it is the door to all moments.",
    interpretation: "You're not in the past (it's gone) or the future (it's not here). You're here. Right now. This breath, this moment — it's the only one that's real. Start here.",
    themes: ["presence", "mindfulness", "now", "awareness"],
    moodTags: ["anxious", "restless", "overwhelmed", "confused"],
  },

  // === YOGA SUTRAS ===
  {
    id: "yoga-1-2",
    tradition: "yoga_sutras",
    source: "Yoga Sutras of Patanjali",
    reference: "Sutra 1.2",
    text: "Yogas chitta vritti nirodha — Yoga is the cessation of the fluctuations of the mind.",
    interpretation: "The goal isn't to think harder — it's to think less. When the mental noise settles, what remains is clarity. Every breathing exercise, every meditation, moves you toward this stillness.",
    themes: ["stillness", "mind", "clarity", "practice"],
    moodTags: ["restless", "anxious", "overwhelmed"],
  },
  {
    id: "yoga-1-12",
    tradition: "yoga_sutras",
    source: "Yoga Sutras of Patanjali",
    reference: "Sutra 1.12",
    text: "Abhyasa vairagyabhyam tan nirodhah — These mental modifications are restrained by practice and non-attachment.",
    interpretation: "Two tools: consistent practice and letting go. Practice builds the muscle. Non-attachment removes the weight. Together, they quiet the mind's chaos.",
    themes: ["practice", "non-attachment", "discipline", "growth"],
    moodTags: ["restless", "anxious", "hopeful"],
  },
  {
    id: "yoga-2-33",
    tradition: "yoga_sutras",
    source: "Yoga Sutras of Patanjali",
    reference: "Sutra 2.33",
    text: "Vitarka badhane pratipaksha bhavanam — When disturbed by negative thoughts, opposite ones should be thought of.",
    interpretation: "When the mind spirals negative, consciously introduce the opposite thought. Not as denial, but as balance. Anxiety about failure? Recall a time you succeeded. The mind can be trained.",
    themes: ["reframing", "balance", "mindset", "discipline"],
    moodTags: ["anxious", "sad", "angry", "hopeless"],
  },
];

// === BREATHWORK EXERCISES ===

export interface BreathworkExercise {
  id: string;
  name: string;
  slug: string;
  description: string;
  steps: { instruction: string; durationSeconds: number; phase: string }[];
  totalDurationSeconds: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  useCases: string[];
  moodTags: string[];
}

export const breathworkExercises: BreathworkExercise[] = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    slug: "box-breathing",
    description: "Equal-ratio breathing used by Navy SEALs to calm the nervous system quickly. Inhale, hold, exhale, hold — each for 4 seconds.",
    steps: [
      { instruction: "Inhale slowly through your nose", durationSeconds: 4, phase: "inhale" },
      { instruction: "Hold your breath gently", durationSeconds: 4, phase: "hold" },
      { instruction: "Exhale slowly through your mouth", durationSeconds: 4, phase: "exhale" },
      { instruction: "Hold empty", durationSeconds: 4, phase: "hold" },
    ],
    totalDurationSeconds: 128, // 8 rounds
    difficulty: "beginner",
    useCases: ["anxiety", "focus", "stress", "pre-decision"],
    moodTags: ["anxious", "restless", "overwhelmed", "frustrated"],
  },
  {
    id: "4-7-8-breathing",
    name: "4-7-8 Relaxation Breath",
    slug: "4-7-8-breathing",
    description: "Dr. Andrew Weil's relaxation technique. The extended exhale activates the parasympathetic nervous system, slowing heart rate and promoting calm.",
    steps: [
      { instruction: "Inhale quietly through your nose", durationSeconds: 4, phase: "inhale" },
      { instruction: "Hold your breath", durationSeconds: 7, phase: "hold" },
      { instruction: "Exhale completely through your mouth with a whoosh", durationSeconds: 8, phase: "exhale" },
    ],
    totalDurationSeconds: 114, // 6 rounds
    difficulty: "beginner",
    useCases: ["sleep", "anxiety", "calm", "relaxation"],
    moodTags: ["anxious", "restless", "overwhelmed", "sad"],
  },
  {
    id: "coherent-breathing",
    name: "Coherent Breathing (5-5)",
    slug: "coherent-breathing",
    description: "Breathe at 5 seconds in, 5 seconds out — approximately 6 breaths per minute. This rate maximizes heart rate variability and calm.",
    steps: [
      { instruction: "Inhale slowly and deeply", durationSeconds: 5, phase: "inhale" },
      { instruction: "Exhale slowly and completely", durationSeconds: 5, phase: "exhale" },
    ],
    totalDurationSeconds: 120, // 12 rounds
    difficulty: "beginner",
    useCases: ["calm", "focus", "daily practice", "meditation prep"],
    moodTags: ["restless", "anxious", "confused"],
  },
  {
    id: "energizing-breath",
    name: "Energizing Breath (Kapalabhati)",
    slug: "energizing-breath",
    description: "Short, powerful exhales followed by passive inhales. Clears the mind and increases alertness. Not recommended before sleep.",
    steps: [
      { instruction: "Sit tall. Take a deep breath in", durationSeconds: 3, phase: "inhale" },
      { instruction: "Forcefully exhale through your nose, pulling your navel in", durationSeconds: 1, phase: "exhale" },
      { instruction: "Let the inhale happen passively", durationSeconds: 1, phase: "inhale" },
      { instruction: "Repeat rapid exhale-inhale 20 times", durationSeconds: 40, phase: "active" },
      { instruction: "Take a deep breath in and hold", durationSeconds: 5, phase: "hold" },
      { instruction: "Exhale slowly", durationSeconds: 5, phase: "exhale" },
    ],
    totalDurationSeconds: 165, // 3 rounds
    difficulty: "intermediate",
    useCases: ["energy", "focus", "morning", "alertness"],
    moodTags: ["sad", "hopeless", "lonely"],
  },
  {
    id: "alternate-nostril",
    name: "Alternate Nostril Breathing (Nadi Shodhana)",
    slug: "alternate-nostril",
    description: "Balances the left and right hemispheres of the brain. Calming yet focusing. Traditional yogic pranayama technique.",
    steps: [
      { instruction: "Close your right nostril with your thumb. Inhale through left nostril", durationSeconds: 4, phase: "inhale" },
      { instruction: "Close both nostrils. Hold", durationSeconds: 4, phase: "hold" },
      { instruction: "Release right nostril. Exhale through right", durationSeconds: 4, phase: "exhale" },
      { instruction: "Inhale through right nostril", durationSeconds: 4, phase: "inhale" },
      { instruction: "Close both nostrils. Hold", durationSeconds: 4, phase: "hold" },
      { instruction: "Release left nostril. Exhale through left", durationSeconds: 4, phase: "exhale" },
    ],
    totalDurationSeconds: 144, // 6 rounds
    difficulty: "intermediate",
    useCases: ["balance", "focus", "calm", "meditation prep"],
    moodTags: ["restless", "anxious", "confused"],
  },
  {
    id: "belly-breathing",
    name: "Belly Breathing (Diaphragmatic)",
    slug: "belly-breathing",
    description: "The simplest and most fundamental breathing technique. Engages the diaphragm fully, promoting deep relaxation.",
    steps: [
      { instruction: "Place one hand on your chest, one on your belly", durationSeconds: 3, phase: "setup" },
      { instruction: "Breathe in slowly through your nose — feel your belly rise, chest stays still", durationSeconds: 5, phase: "inhale" },
      { instruction: "Exhale slowly through pursed lips — feel your belly fall", durationSeconds: 6, phase: "exhale" },
    ],
    totalDurationSeconds: 132, // 10 rounds
    difficulty: "beginner",
    useCases: ["relaxation", "sleep", "anxiety", "beginner"],
    moodTags: ["anxious", "overwhelmed", "sad", "restless"],
  },
];

// === AFFIRMATION CATEGORIES ===

export interface Affirmation {
  id: string;
  category: string;
  text: string;
  tradition: string;
  moodTags: string[];
}

export const affirmations: Affirmation[] = [
  { id: "aff-1", category: "calm", text: "I am not my thoughts. I am the awareness behind them.", tradition: "buddhist", moodTags: ["anxious", "overwhelmed"] },
  { id: "aff-2", category: "calm", text: "This moment is enough. I don't need to be anywhere else.", tradition: "buddhist", moodTags: ["restless", "anxious"] },
  { id: "aff-3", category: "resilience", text: "I focus on what I can control and release what I cannot.", tradition: "stoic", moodTags: ["frustrated", "overwhelmed"] },
  { id: "aff-4", category: "resilience", text: "Difficulty is the training ground for strength.", tradition: "stoic", moodTags: ["sad", "hopeless"] },
  { id: "aff-5", category: "purpose", text: "My duty is to act with intention, not to control results.", tradition: "gita", moodTags: ["anxious", "confused"] },
  { id: "aff-6", category: "purpose", text: "I walk my own path. Comparison is a distraction from dharma.", tradition: "gita", moodTags: ["envious", "confused"] },
  { id: "aff-7", category: "confidence", text: "I elevate myself through the power of my own mind.", tradition: "gita", moodTags: ["hopeful", "restless"] },
  { id: "aff-8", category: "confidence", text: "I have faced difficulty before. I will face this too.", tradition: "stoic", moodTags: ["anxious", "sad"] },
  { id: "aff-9", category: "gratitude", text: "I am alive, aware, and capable of growth. That is enough.", tradition: "buddhist", moodTags: ["grateful", "hopeful"] },
  { id: "aff-10", category: "gratitude", text: "Every breath is a gift. Every moment, a chance to begin again.", tradition: "yoga_sutras", moodTags: ["peaceful", "grateful"] },
  { id: "aff-11", category: "focus", text: "I direct my attention like a steady flame — one task, one moment.", tradition: "yoga_sutras", moodTags: ["restless", "overwhelmed"] },
  { id: "aff-12", category: "focus", text: "I choose depth over distraction. Quality over quantity.", tradition: "stoic", moodTags: ["restless", "confused"] },
  { id: "aff-13", category: "self-worth", text: "I am not defined by outcomes. My worth comes from within.", tradition: "gita", moodTags: ["sad", "hopeless", "anxious"] },
  { id: "aff-14", category: "self-worth", text: "I treat myself with the same compassion I offer others.", tradition: "buddhist", moodTags: ["sad", "lonely"] },
];

// === MEDITATION TEMPLATES ===

export interface MeditationTemplate {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  style: "guided" | "silent_timer" | "mantra" | "visualization";
  script: string;
  moodTags: string[];
}

export const meditationTemplates: MeditationTemplate[] = [
  {
    id: "morning-intention-5",
    name: "Morning Intention Setting",
    category: "morning",
    durationMinutes: 5,
    style: "guided",
    script: `Welcome to this morning meditation. Take a comfortable seat and close your eyes.

Begin with three deep breaths. Inhale through your nose... exhale through your mouth.

Now, set an intention for today. Not a to-do item — an intention for how you want to show up.
Perhaps: "Today I choose patience." Or "Today I choose presence."

Hold this intention in your mind. Feel it in your body.

As you go through your day, let this intention be your anchor.
When things get chaotic, come back to it.

Take one more deep breath. Open your eyes.
Carry your intention with you.`,
    moodTags: ["hopeful", "peaceful", "restless"],
  },
  {
    id: "stress-relief-3",
    name: "Quick Stress Relief",
    category: "stress_relief",
    durationMinutes: 3,
    style: "guided",
    script: `Stop what you're doing. Close your eyes if you can.

Take one deep breath. Hold it. Release it slowly.

Now scan your body. Where are you holding tension? Jaw? Shoulders? Stomach?
Breathe into that area. Imagine the tension dissolving with each exhale.

Three more breaths:
Inhale peace... Exhale tension.
Inhale calm... Exhale worry.
Inhale presence... Exhale everything else.

You don't need to solve anything right now.
You just need to be here.

Open your eyes when you're ready.`,
    moodTags: ["anxious", "overwhelmed", "frustrated", "angry"],
  },
  {
    id: "focus-5",
    name: "Focus & Clarity",
    category: "focus",
    durationMinutes: 5,
    style: "guided",
    script: `Sit upright. Feet on the ground. Hands resting.

Close your eyes and bring your attention to the sensation of breathing at your nostrils.
The cool air entering. The warm air leaving.

Your mind will wander. That's normal. Each time it does, gently bring it back to the breath.
No judgment. Just return.

Now think of the one thing you need to focus on next.
Hold it clearly in your mind. See yourself doing it with calm, focused energy.

You have what you need. The clarity is already here.

Take a deep breath. Open your eyes.
Go do the one thing.`,
    moodTags: ["restless", "confused", "overwhelmed"],
  },
  {
    id: "gratitude-3",
    name: "Gratitude Practice",
    category: "gratitude",
    durationMinutes: 3,
    style: "guided",
    script: `Close your eyes and take a slow breath.

Think of one person you're grateful for. Picture their face.
What did they give you? Time? Support? A kind word?
Silently say: "Thank you."

Think of one thing about today that went right. Even something small.
A warm drink. A moment of quiet. A task completed.
Silently acknowledge: "This was good."

Think of one thing about yourself you appreciate.
Your persistence. Your kindness. Your willingness to try.
Silently say: "I'm doing okay."

Breathe in gratitude. Breathe out whatever weighs you down.

Open your eyes. Carry this warmth with you.`,
    moodTags: ["grateful", "hopeful", "sad", "lonely"],
  },
  {
    id: "body-scan-10",
    name: "Body Scan Relaxation",
    category: "body_scan",
    durationMinutes: 10,
    style: "guided",
    script: `Lie down or sit comfortably. Close your eyes.

Take three deep breaths to arrive in your body.

We'll scan from your feet to the top of your head.

Start with your feet. Notice any sensation — warmth, tingling, numbness. Don't change it. Just notice.
Move to your ankles... your calves... your knees.
Breathe into any areas of tension.

Now your thighs... your hips... your lower back.
Let the weight of your body sink into the surface beneath you.

Move to your stomach... your chest... notice your breath here.
Your shoulders — often holding more than they need to. Let them drop.

Your arms... your hands... your fingers.
Your neck... your jaw — unclench it gently.
Your face — soften your forehead, your eyes, your lips.

The top of your head. Imagine a warm light there, spreading down through your entire body.

You are held. You are safe. You are here.

When you're ready, wiggle your fingers and toes.
Open your eyes slowly. Return to the room with gentleness.`,
    moodTags: ["anxious", "overwhelmed", "sad", "restless"],
  },
];
