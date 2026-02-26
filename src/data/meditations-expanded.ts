/**
 * Expanded meditation templates — adds loving_kindness, evening_wind_down, + more durations
 * Total: 16 additional meditations (7 categories × 2-3 durations)
 */
import { MeditationTemplate } from "./wisdom";

export const meditationsExpanded: MeditationTemplate[] = [
  // LOVING KINDNESS (new category from spec)
  {
    id: "loving-kindness-5",
    name: "Loving Kindness (Metta)",
    category: "loving_kindness",
    durationMinutes: 5,
    style: "guided",
    script: `Sit comfortably and close your eyes. Take three gentle breaths.

Begin by directing love toward yourself: "May I be happy. May I be healthy. May I be safe. May I live with ease."
Feel the warmth of these words in your chest.

Now think of someone you love: "May you be happy. May you be healthy. May you be safe. May you live with ease."

Extend this to a neutral person — someone you see but don't know well. A neighbor, a shopkeeper.
"May you be happy. May you be healthy. May you be safe. May you live with ease."

Finally, extend this to all beings everywhere: "May all beings be happy. May all beings be free from suffering."

Rest in this feeling of universal love. You are both the giver and receiver.

Take a deep breath. Open your eyes. Carry this warmth into your day.`,
    moodTags: ["lonely", "sad", "angry", "grateful"],
  },
  {
    id: "loving-kindness-10",
    name: "Extended Loving Kindness",
    category: "loving_kindness",
    durationMinutes: 10,
    style: "guided",
    script: `Find a comfortable position. Let your eyes close naturally. Take several slow, deep breaths.

Place your hand on your heart. Feel its beating — steady, faithful, always working for you.

Begin with yourself. Silently repeat: "May I be happy. May I be healthy. May I be safe. May I live with ease."
Stay here for a full minute. Let the words sink in. If resistance arises, that's okay — offer yourself compassion for the resistance too.

Now picture someone you deeply love. See their face. "May you be happy. May you be healthy. May you be safe. May you live with ease."
Spend a full minute sending them love.

Think of a friend. "May you be happy. May you be healthy. May you be safe. May you live with ease."

Now a neutral person — someone whose story you don't know. "May you be happy. May you be healthy. May you be safe."

The hardest part: think of someone you find difficult. Not your worst enemy — just someone who challenges you.
"May you be happy. May you be healthy. May you be safe." This is not condoning their behavior. This is freeing yourself.

Finally, expand to all beings. Every person on every continent. Every animal. Every living thing.
"May all beings be happy. May all beings be free from suffering. May all beings find peace."

Rest in this vast, boundless love. You are part of this web.

Gently bring your awareness back. Open your eyes. You've just practiced the most powerful force in the universe.`,
    moodTags: ["lonely", "sad", "angry", "frustrated", "grateful"],
  },

  // EVENING WIND DOWN (new category from spec)
  {
    id: "evening-wind-down-5",
    name: "Evening Wind Down",
    category: "evening_wind_down",
    durationMinutes: 5,
    style: "guided",
    script: `The day is ending. Give yourself permission to stop.

Close your eyes. Take a slow, deep breath — longer exhale than inhale.

Scan through your day like watching a movie on fast-forward. Don't judge — just observe.
What happened? What did you feel? What did you learn?

Now let it all go. The day is done. Nothing more can be added or changed.

Think of one thing from today that you're grateful for. Hold it gently.

Think of one thing you'd like to release. A worry, a frustration, a regret. Breathe it out.

Set a soft intention for rest: "I have done enough today. I deserve rest."

Three slow breaths. Let sleep begin to find you. Goodnight.`,
    moodTags: ["restless", "overwhelmed", "anxious", "sad"],
  },
  {
    id: "evening-wind-down-10",
    name: "Deep Evening Release",
    category: "evening_wind_down",
    durationMinutes: 10,
    style: "guided",
    script: `Lie down or recline comfortably. Let your body be heavy. Close your eyes.

Take five slow breaths. With each exhale, feel yourself sinking deeper into the surface beneath you.

The day held many things. Let's gently review and release them.

Morning: What did the morning hold? Meetings, conversations, meals? Notice without judgment. Breathe. Release.

Afternoon: What happened in the middle of your day? Any stress, any joy? Notice. Breathe. Release.

Evening: The final hours. How did they unfold? Notice. Breathe. Release.

Now, three things to acknowledge:
One thing you did well today — even something small. Acknowledge it.
One thing you'd do differently — not with guilt, but with the calm wisdom of hindsight.
One thing you're grateful for — something that made today worth living.

Now release it all. The day is a letter you've finished writing. Seal it. Put it away.

Your only job now is rest. Your body will heal itself tonight. Your mind will process and organize.

Feel your body getting heavier. Warmer. Safer.

You have done enough. You are enough. Rest now.`,
    moodTags: ["restless", "overwhelmed", "anxious", "sad", "grateful"],
  },

  // MORNING — additional duration
  {
    id: "morning-intention-10",
    name: "Morning Clarity & Intention",
    category: "morning",
    durationMinutes: 10,
    style: "guided",
    script: `Good morning. Before the day takes you, take a moment for yourself.

Sit comfortably. Close your eyes. Take five deep, slow breaths.

Notice how you feel right now — physically, emotionally, mentally. No judgment. Just awareness.

Scan your body from head to toe. Where do you feel tension? Breathe into those areas.

Now bring to mind the day ahead. What's on your plate? Don't plan — just observe what's there.

Set a quality intention: not what you'll DO, but who you'll BE.
"Today I choose patience." "Today I choose courage." "Today I choose presence."

Visualize yourself moving through the day with this quality. See yourself handling challenges with it.

Now, call to mind one wisdom teaching:
"You have a right to your work, but not to the fruits of your work."
Carry this with you.

Three final breaths. Inhale possibility. Exhale doubt.

Open your eyes. The day is yours. Move with intention.`,
    moodTags: ["hopeful", "restless", "anxious", "peaceful"],
  },

  // STRESS RELIEF — longer version
  {
    id: "stress-relief-10",
    name: "Deep Stress Release",
    category: "stress_relief",
    durationMinutes: 10,
    style: "guided",
    script: `Find a quiet place. Sit or lie down. Close your eyes.

We're going to release stress from your body and mind in three stages.

STAGE 1: BODY (3 minutes)
Take the deepest breath you've taken all day. Hold for 3 seconds. Release slowly.
Again — deep inhale. Hold. Slow, complete exhale.
One more time.

Now tense every muscle in your body. Your fists, your face, your toes. Hold the tension... hold it... and release completely.
Feel the difference between tension and release. That's what we're going for.

STAGE 2: MIND (4 minutes)
Your thoughts are like a river right now — fast, muddy, chaotic.
You are sitting on the bank, watching the river. You are NOT in the river.
Watch the thoughts flow by. "There goes worry." "There goes planning." "There goes judgment."
You don't need to follow any of them. Just watch.

If a thought grabs you and pulls you in, that's okay. Notice it happened. Return to the bank.

STAGE 3: HEART (3 minutes)
Place your hand on your heart. Feel it beating.
Say silently: "I am doing my best. That is enough."
"I release what I cannot control."
"I am safe in this moment."

Take three final breaths. Each one slower than the last.

Open your eyes. The stress isn't gone — but you've loosened its grip. That's enough for now.`,
    moodTags: ["anxious", "overwhelmed", "frustrated", "angry", "restless"],
  },

  // FOCUS — longer version
  {
    id: "focus-10",
    name: "Deep Focus Training",
    category: "focus",
    durationMinutes: 10,
    style: "guided",
    script: `Sit upright. Feet flat on the ground. Hands resting on your lap.

Close your eyes. We're going to train your attention like a muscle.

First, anchor on your breath. Feel the air entering your nostrils. Feel it leaving. That's your home base.

Count your breaths. Inhale — one. Exhale — two. Inhale — three. Continue to ten.
If you lose count, start over at one. No frustration — losing count IS the training.

Do this for three rounds of ten.

Now, choose a single word that represents what you need right now.
"Clarity." "Calm." "Strength." "Focus."
Repeat it silently with each exhale. Let it fill your mind.

When other thoughts intrude — and they will — notice them and return to your word. Every return builds your focus muscle.

Now imagine a single candle flame in your mind's eye. Steady, unwavering.
That flame is your attention. Hold it still. If it flickers, steady it gently.

Hold this for two minutes in silence.

Three deep breaths to finish.

Open your eyes. Your mind is sharper now. Direct it with intention.`,
    moodTags: ["restless", "confused", "overwhelmed"],
  },

  // GRATITUDE — longer version
  {
    id: "gratitude-10",
    name: "Deep Gratitude Practice",
    category: "gratitude",
    durationMinutes: 10,
    style: "guided",
    script: `Close your eyes and settle in. Take three cleansing breaths.

We often rush past the good in our lives to focus on what's missing. This practice reverses that.

LAYER 1: BODY GRATITUDE (2 min)
Thank your body. Your heart has beaten about 100,000 times today without you asking.
Your lungs have breathed for you. Your eyes have seen beauty.
Silently: "Thank you, body, for carrying me through another day."

LAYER 2: PEOPLE GRATITUDE (3 min)
Think of three people who've made your life better. Not necessarily today — ever.
See each face. Feel what they gave you. Love, support, a lesson, a laugh.
For each one: "Thank you. I am better because of you."

LAYER 3: EXPERIENCE GRATITUDE (3 min)
Think of three experiences from this week — even small ones.
A good meal. A moment of laughter. A quiet morning. A task completed.
For each: "This happened. It was good. I noticed."

LAYER 4: CHALLENGE GRATITUDE (2 min)
This is harder. Think of one difficulty you faced recently.
What did it teach you? How did it make you stronger?
"Thank you, difficulty, for what you taught me."

Rest in this warm feeling of abundance. Not everything is perfect. But so much is good.

Take a deep breath. Open your eyes. Carry gratitude like a lens — it changes everything you see.`,
    moodTags: ["sad", "lonely", "grateful", "hopeful"],
  },

  // BODY SCAN — shorter version
  {
    id: "body-scan-5",
    name: "Quick Body Scan",
    category: "body_scan",
    durationMinutes: 5,
    style: "guided",
    script: `Close your eyes. Three deep breaths.

Quick scan — we'll move through your body in 5 minutes.

Feet and legs — notice any sensation. Breathe into them. Release.
Hips and lower back — often holding stress. Breathe. Release.
Stomach and chest — where emotions live. Breathe. Release.
Shoulders and arms — let them drop. Heavier. Release.
Neck and jaw — unclench. Soften. Release.
Face and head — smooth your forehead. Relax your eyes. Release.

Your whole body has been acknowledged. You've given it attention it rarely gets.

Three breaths. Feel the weight of your body. Feel how held you are.

Open your eyes gently. Thank your body for this moment.`,
    moodTags: ["anxious", "overwhelmed", "restless", "sad"],
  },

  // MANTRA meditation
  {
    id: "mantra-5",
    name: "Mantra Meditation (Om)",
    category: "mantra",
    durationMinutes: 5,
    style: "mantra",
    script: `Sit tall. Close your eyes. Take three preparatory breaths.

We'll use the mantra "Om" — the universal sound of consciousness.

On each exhale, silently (or softly aloud) repeat: "Om."
Feel the vibration in your chest. Let it fill your body.

Inhale... "Om" on the exhale.
Again. And again. Let the rhythm become natural.

When thoughts arise, let the mantra gently push them aside. The mantra is your anchor.

Continue for the next few minutes. Just the breath and the sound.

Three final Oms — let each one be slower and more intentional than the last.

Sit in the silence that follows. Notice the space the mantra created.

Open your eyes. Peace is always one Om away.`,
    moodTags: ["restless", "anxious", "overwhelmed", "peaceful"],
  },

  // VISUALIZATION
  {
    id: "visualization-5",
    name: "Safe Place Visualization",
    category: "visualization",
    durationMinutes: 5,
    style: "visualization",
    script: `Close your eyes. Three slow breaths.

Imagine a place where you feel completely safe. It could be real or imagined.
A beach. A forest. A cozy room. A mountaintop.

See it clearly. What colors do you see? What's the light like?
What do you hear? Waves? Birds? Silence? Wind?
What do you feel on your skin? Warmth? A cool breeze?
What do you smell? Salt air? Pine? Fresh rain?

You are there now. Completely safe. Nothing can reach you here.

Walk through this space slowly. Touch things. Sit down somewhere comfortable.

Know that this place exists inside you. You can return here anytime, anywhere.
In a meeting. In traffic. In the middle of the night.

Take a deep breath of this safe air. Feel it fill your lungs.

Begin to bring your awareness back to the room. But keep this place in your heart.

Open your eyes. Your safe place is always one breath away.`,
    moodTags: ["anxious", "overwhelmed", "sad", "lonely"],
  },
];
