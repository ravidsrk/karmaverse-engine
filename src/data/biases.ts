/**
 * Cognitive bias library for the Decide layer.
 * 12 detectable biases with signal patterns and wisdom connections.
 */

export interface CognitiveBias {
  id: string;
  name: string;
  description: string;
  signalPatterns: string[];
  debiasingStrategy: string;
  wisdomConnection: {
    tradition: string;
    reference: string;
    insight: string;
  };
}

export const cognitiveBiases: CognitiveBias[] = [
  {
    id: "sunk-cost",
    name: "Sunk Cost Fallacy",
    description: "Continuing a behavior or endeavor because of previously invested resources (time, money, effort) that cannot be recovered.",
    signalPatterns: [
      "I've already invested",
      "I've put so much into",
      "I can't quit now after",
      "it would be a waste to stop",
      "I've come this far",
    ],
    debiasingStrategy: "Ask: 'If I were starting fresh today, with no history, would I choose this?' The past investment is gone regardless of your next choice. Only future costs and benefits matter.",
    wisdomConnection: {
      tradition: "Gita",
      reference: "Chapter 2, Verse 47",
      insight: "Non-attachment to past action. Your right is to action alone, not to past investments. What matters is the next right step, not justifying the previous ones.",
    },
  },
  {
    id: "status-quo",
    name: "Status Quo Bias",
    description: "Preference for the current state of affairs, even when change would be beneficial. The default feels safer simply because it's familiar.",
    signalPatterns: [
      "I'd rather not change",
      "the safe choice is to stay",
      "why fix what isn't broken",
      "I'm comfortable with",
      "better the devil you know",
    ],
    debiasingStrategy: "Flip the frame: if you were in the new situation, would you switch to the current one? If not, the status quo isn't actually preferred — it's just familiar.",
    wisdomConnection: {
      tradition: "Gita",
      reference: "Chapter 3, Verse 35",
      insight: "Dharma is about growth, not comfort. Your duty may require moving forward even when staying feels safer.",
    },
  },
  {
    id: "confirmation",
    name: "Confirmation Bias",
    description: "Seeking, interpreting, and remembering information that confirms pre-existing beliefs while ignoring contradictory evidence.",
    signalPatterns: [
      "everyone I asked agrees",
      "all the research I've seen",
      "I already know that",
      "it just confirms what I thought",
      "obviously the right choice",
    ],
    debiasingStrategy: "Actively seek disconfirming evidence. Ask: 'What would change my mind?' and 'Who disagrees with me, and why?' Give the opposing view a genuine hearing.",
    wisdomConnection: {
      tradition: "Buddhist",
      reference: "Right View (Samma Ditthi)",
      insight: "Right view requires seeing all sides, not just the comfortable ones. The mind filters reality to match beliefs — investigation reveals the full picture.",
    },
  },
  {
    id: "anchoring",
    name: "Anchoring Bias",
    description: "Over-relying on the first piece of information encountered when making decisions, using it as a reference point for all subsequent judgments.",
    signalPatterns: [
      "the first offer was",
      "compared to the original",
      "but they initially said",
      "the starting point was",
      "relative to what I first heard",
    ],
    debiasingStrategy: "Set your own anchor independently before looking at others' numbers. Ask: 'What would I estimate this at if I hadn't heard that first number?'",
    wisdomConnection: {
      tradition: "Stoic",
      reference: "Epictetus, Enchiridion 5",
      insight: "Examine impressions before accepting them. The first piece of information is just an impression — test it before letting it shape your judgment.",
    },
  },
  {
    id: "loss-aversion",
    name: "Loss Aversion",
    description: "The tendency to prefer avoiding losses over acquiring equivalent gains. Losses are felt roughly twice as powerfully as gains.",
    signalPatterns: [
      "I can't afford to lose",
      "what if it doesn't work out",
      "I don't want to give up",
      "the risk of losing",
      "I might lose what I have",
    ],
    debiasingStrategy: "List gains and losses separately. Ask: 'Am I avoiding this because the loss is real, or because my brain overweights it?' Consider what you gain, not just what you risk.",
    wisdomConnection: {
      tradition: "Gita",
      reference: "Chapter 2, Verse 14",
      insight: "Pain and pleasure are transient — they come and go like seasons. Don't make permanent decisions based on temporary discomfort.",
    },
  },
  {
    id: "recency",
    name: "Recency Bias",
    description: "Giving disproportionate weight to recent events over historical patterns. One bad day overshadows months of good ones.",
    signalPatterns: [
      "just happened",
      "this week has been",
      "I just had a terrible",
      "after what happened yesterday",
      "right now everything feels",
    ],
    debiasingStrategy: "Zoom out. Ask: 'How would I feel about this if it happened 6 months ago?' Look at the pattern over weeks or months, not the last few hours.",
    wisdomConnection: {
      tradition: "Stoic",
      reference: "Marcus Aurelius, Meditations Book 7",
      insight: "The view from above — see your life from a distance. One event in a lifetime of events. This too is a passing moment in a larger story.",
    },
  },
  {
    id: "availability",
    name: "Availability Heuristic",
    description: "Judging the likelihood of events based on how easily examples come to mind, rather than actual probability.",
    signalPatterns: [
      "I keep hearing about",
      "everyone seems to",
      "it's happening all around me",
      "I just saw a story about",
      "it feels like this always",
    ],
    debiasingStrategy: "Ask: 'Is this common, or just memorable?' Look up actual statistics. What comes to mind easily isn't necessarily what happens frequently.",
    wisdomConnection: {
      tradition: "Buddhist",
      reference: "Dhammapada, Verse 1",
      insight: "The mind distorts reality. What it presents as 'common' may just be 'vivid.' Investigate before believing your mental impressions.",
    },
  },
  {
    id: "bandwagon",
    name: "Bandwagon Effect",
    description: "Adopting beliefs or behaviors because many others have done so, regardless of underlying evidence.",
    signalPatterns: [
      "everyone else is doing it",
      "I don't want to miss out",
      "it's the popular choice",
      "all my friends think",
      "the trend is toward",
    ],
    debiasingStrategy: "Strip away the social proof. Ask: 'If nobody else were doing this, would I still want to?' Your path is yours alone.",
    wisdomConnection: {
      tradition: "Gita",
      reference: "Chapter 3, Verse 35",
      insight: "Follow your own path — svadharma. It is far better to perform one's own duty imperfectly than another's perfectly.",
    },
  },
  {
    id: "dunning-kruger",
    name: "Dunning-Kruger Effect",
    description: "Overestimating one's competence in areas where one has limited knowledge or experience.",
    signalPatterns: [
      "how hard can it be",
      "I already know enough",
      "I'm sure I can figure it out",
      "it seems straightforward",
      "I don't need help with this",
    ],
    debiasingStrategy: "Consult someone with genuine expertise. Ask: 'What am I not seeing that an expert would?' Humility is not weakness — it's wisdom.",
    wisdomConnection: {
      tradition: "Yoga Sutras",
      reference: "Sutra 2.5 (Avidya)",
      insight: "Avidya — ignorance, especially ignorance of one's own ignorance — is the root obstacle. Recognizing what you don't know is the first step to knowledge.",
    },
  },
  {
    id: "planning-fallacy",
    name: "Planning Fallacy",
    description: "Underestimating the time, costs, and risks of future actions, even when past experience shows such estimates are overly optimistic.",
    signalPatterns: [
      "this should only take",
      "I can easily do this by",
      "it won't be that hard",
      "I'll have it done in",
      "just a quick",
    ],
    debiasingStrategy: "Use reference class forecasting: 'How long did similar tasks take in the past?' Add 50% buffer. Ask someone who's done it before for their estimate.",
    wisdomConnection: {
      tradition: "Stoic",
      reference: "Seneca, Premeditatio Malorum",
      insight: "Pre-meditate on difficulties. The Stoics practiced imagining what could go wrong — not from pessimism, but from preparedness.",
    },
  },
  {
    id: "hindsight",
    name: "Hindsight Bias",
    description: "The tendency to believe, after an event has occurred, that one would have predicted or expected the outcome.",
    signalPatterns: [
      "I knew it all along",
      "it was obvious that",
      "I could have predicted",
      "anyone could see that coming",
      "I always thought this would",
    ],
    debiasingStrategy: "Before the outcome was known, what did you actually think? Write predictions down before events to calibrate your real predictive ability.",
    wisdomConnection: {
      tradition: "Buddhist",
      reference: "Beginner's Mind (Shoshin)",
      insight: "Approach each situation with beginner's mind. The illusion of 'I knew it all along' prevents learning from what actually surprised you.",
    },
  },
  {
    id: "framing",
    name: "Framing Effect",
    description: "Drawing different conclusions from the same information depending on how it's presented — as a gain or as a loss.",
    signalPatterns: [
      "when you put it that way",
      "it depends on how you look at it",
      "if you think of it as",
      "from that perspective",
      "the way they described it",
    ],
    debiasingStrategy: "Reframe the decision both ways. '90% success rate' = '10% failure rate.' Do your preferences change? If so, you're being influenced by framing, not facts.",
    wisdomConnection: {
      tradition: "Stoic",
      reference: "Epictetus, Enchiridion 5",
      insight: "See things as they are, not as they are presented. Strip away the framing to find the underlying reality.",
    },
  },
];
