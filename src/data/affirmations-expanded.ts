/**
 * Expanded affirmations — 8 categories × ~10 each = ~80 total
 * Categories: calm, resilience, purpose, confidence, gratitude, focus, self-worth, letting_go
 */
import { Affirmation } from "./wisdom";

export const affirmationsExpanded: Affirmation[] = [
  // CALM (10)
  { id: "aff-c-1", category: "calm", text: "I release the need to control what I cannot change.", tradition: "stoic", moodTags: ["anxious", "overwhelmed"] },
  { id: "aff-c-2", category: "calm", text: "My breath is my anchor. I return to it now.", tradition: "buddhist", moodTags: ["anxious", "restless"] },
  { id: "aff-c-3", category: "calm", text: "This too shall pass. Nothing is permanent — not even this feeling.", tradition: "buddhist", moodTags: ["anxious", "sad", "overwhelmed"] },
  { id: "aff-c-4", category: "calm", text: "I choose peace over the need to be right.", tradition: "buddhist", moodTags: ["angry", "frustrated"] },
  { id: "aff-c-5", category: "calm", text: "Like the ocean, I can hold vast waves without being disturbed.", tradition: "gita", moodTags: ["overwhelmed", "restless"] },
  { id: "aff-c-6", category: "calm", text: "I do not need to solve everything right now. Being present is enough.", tradition: "yoga_sutras", moodTags: ["overwhelmed", "anxious"] },
  { id: "aff-c-7", category: "calm", text: "My inner peace does not depend on outer circumstances.", tradition: "stoic", moodTags: ["frustrated", "anxious"] },
  { id: "aff-c-8", category: "calm", text: "I rest in the stillness beneath my thoughts.", tradition: "yoga_sutras", moodTags: ["restless", "overwhelmed"] },

  // RESILIENCE (10)
  { id: "aff-r-1", category: "resilience", text: "What stands in the way becomes the way.", tradition: "stoic", moodTags: ["frustrated", "overwhelmed"] },
  { id: "aff-r-2", category: "resilience", text: "I have survived every difficult day so far. This one will be no different.", tradition: "stoic", moodTags: ["sad", "overwhelmed"] },
  { id: "aff-r-3", category: "resilience", text: "Difficulty is my teacher, not my enemy.", tradition: "buddhist", moodTags: ["frustrated", "sad"] },
  { id: "aff-r-4", category: "resilience", text: "I bend with the wind but I do not break.", tradition: "yoga_sutras", moodTags: ["overwhelmed", "anxious"] },
  { id: "aff-r-5", category: "resilience", text: "Every ending contains the seed of a new beginning.", tradition: "gita", moodTags: ["sad", "hopeful"] },
  { id: "aff-r-6", category: "resilience", text: "My strength is not in never falling, but in rising every time I fall.", tradition: "gita", moodTags: ["sad", "frustrated", "overwhelmed"] },
  { id: "aff-r-7", category: "resilience", text: "Sometimes even to live is an act of courage. Today, I am courageous.", tradition: "stoic", moodTags: ["sad", "lonely", "overwhelmed"] },
  { id: "aff-r-8", category: "resilience", text: "I am not fragile. I am antifragile — I grow stronger through challenge.", tradition: "stoic", moodTags: ["frustrated", "anxious"] },

  // PURPOSE (10)
  { id: "aff-p-1", category: "purpose", text: "My path is my own. I walk it without comparison.", tradition: "gita", moodTags: ["confused", "restless"] },
  { id: "aff-p-2", category: "purpose", text: "I show up fully and release the results to life.", tradition: "gita", moodTags: ["anxious", "overwhelmed"] },
  { id: "aff-p-3", category: "purpose", text: "Imperfect action on my own path beats perfect action on someone else's.", tradition: "gita", moodTags: ["confused", "frustrated"] },
  { id: "aff-p-4", category: "purpose", text: "My work is the offering. The outcome is not my concern.", tradition: "gita", moodTags: ["anxious", "restless"] },
  { id: "aff-p-5", category: "purpose", text: "I am exactly where I need to be on my journey.", tradition: "buddhist", moodTags: ["confused", "hopeful"] },
  { id: "aff-p-6", category: "purpose", text: "I choose to act from intention, not reaction.", tradition: "yoga_sutras", moodTags: ["restless", "confused"] },
  { id: "aff-p-7", category: "purpose", text: "My dharma is clear when I listen to my deepest truth.", tradition: "gita", moodTags: ["confused", "hopeful"] },
  { id: "aff-p-8", category: "purpose", text: "Every action I take with awareness moves me closer to who I am meant to be.", tradition: "yoga_sutras", moodTags: ["hopeful", "restless"] },

  // CONFIDENCE (10)
  { id: "aff-conf-1", category: "confidence", text: "I elevate myself through the power of my own mind.", tradition: "gita", moodTags: ["hopeful", "restless"] },
  { id: "aff-conf-2", category: "confidence", text: "I am not my failures. I am the person who keeps going despite them.", tradition: "stoic", moodTags: ["sad", "frustrated"] },
  { id: "aff-conf-3", category: "confidence", text: "I trust my ability to figure things out as they arise.", tradition: "stoic", moodTags: ["anxious", "confused"] },
  { id: "aff-conf-4", category: "confidence", text: "I have conquered hard things before. This is simply the next one.", tradition: "gita", moodTags: ["anxious", "overwhelmed"] },
  { id: "aff-conf-5", category: "confidence", text: "My worth is inherent, not earned through achievement.", tradition: "buddhist", moodTags: ["sad", "anxious"] },
  { id: "aff-conf-6", category: "confidence", text: "I speak my truth with calm authority.", tradition: "yoga_sutras", moodTags: ["anxious", "restless"] },
  { id: "aff-conf-7", category: "confidence", text: "I do not need permission to be who I am.", tradition: "stoic", moodTags: ["confused", "frustrated"] },
  { id: "aff-conf-8", category: "confidence", text: "I am the warrior Arjuna chose to be — I arise and face what is before me.", tradition: "gita", moodTags: ["sad", "overwhelmed", "hopeful"] },

  // GRATITUDE (10)
  { id: "aff-g-1", category: "gratitude", text: "I have enough. I am enough. This moment is enough.", tradition: "stoic", moodTags: ["sad", "restless"] },
  { id: "aff-g-2", category: "gratitude", text: "I notice the small blessings that I usually take for granted.", tradition: "buddhist", moodTags: ["sad", "grateful"] },
  { id: "aff-g-3", category: "gratitude", text: "I am alive, aware, and growing. That is worth celebrating.", tradition: "yoga_sutras", moodTags: ["hopeful", "grateful"] },
  { id: "aff-g-4", category: "gratitude", text: "Even in difficulty, I find something to be grateful for.", tradition: "stoic", moodTags: ["sad", "overwhelmed", "grateful"] },
  { id: "aff-g-5", category: "gratitude", text: "I thank my body for carrying me through this day.", tradition: "yoga_sutras", moodTags: ["peaceful", "grateful"] },
  { id: "aff-g-6", category: "gratitude", text: "Every breath is a gift I did not earn.", tradition: "buddhist", moodTags: ["peaceful", "grateful", "hopeful"] },
  { id: "aff-g-7", category: "gratitude", text: "I choose to see what is here, not what is missing.", tradition: "stoic", moodTags: ["sad", "restless", "grateful"] },
  { id: "aff-g-8", category: "gratitude", text: "Today I received more than I gave. I hold that with humility.", tradition: "gita", moodTags: ["grateful", "peaceful"] },

  // FOCUS (10)
  { id: "aff-f-1", category: "focus", text: "I direct my attention like a steady flame — one task, one moment.", tradition: "yoga_sutras", moodTags: ["restless", "overwhelmed"] },
  { id: "aff-f-2", category: "focus", text: "Distraction is a choice. I choose depth.", tradition: "stoic", moodTags: ["restless", "confused"] },
  { id: "aff-f-3", category: "focus", text: "I return to the present moment as many times as needed, without judgment.", tradition: "buddhist", moodTags: ["restless", "anxious"] },
  { id: "aff-f-4", category: "focus", text: "My mind is a tool I am learning to use with precision.", tradition: "yoga_sutras", moodTags: ["restless", "overwhelmed"] },
  { id: "aff-f-5", category: "focus", text: "I close the tabs of my mind. One thing at a time.", tradition: "stoic", moodTags: ["overwhelmed", "restless"] },
  { id: "aff-f-6", category: "focus", text: "When my mind wanders, I gently bring it back. That IS the practice.", tradition: "buddhist", moodTags: ["restless", "frustrated"] },
  { id: "aff-f-7", category: "focus", text: "Clarity comes from commitment, not from waiting.", tradition: "gita", moodTags: ["confused", "restless"] },
  { id: "aff-f-8", category: "focus", text: "I give my full presence to whatever is in front of me.", tradition: "yoga_sutras", moodTags: ["restless", "overwhelmed"] },

  // SELF-WORTH (10)
  { id: "aff-sw-1", category: "self-worth", text: "I am not defined by outcomes. My worth comes from within.", tradition: "gita", moodTags: ["sad", "anxious"] },
  { id: "aff-sw-2", category: "self-worth", text: "I treat myself with the same compassion I offer others.", tradition: "buddhist", moodTags: ["sad", "lonely"] },
  { id: "aff-sw-3", category: "self-worth", text: "I am worthy of the same kindness I give to those I love.", tradition: "buddhist", moodTags: ["sad", "lonely", "frustrated"] },
  { id: "aff-sw-4", category: "self-worth", text: "My mistakes do not diminish my value. They are part of my growth.", tradition: "stoic", moodTags: ["sad", "frustrated"] },
  { id: "aff-sw-5", category: "self-worth", text: "I release the need for external validation. My inner light is sufficient.", tradition: "yoga_sutras", moodTags: ["sad", "anxious", "restless"] },
  { id: "aff-sw-6", category: "self-worth", text: "I belong in every room I choose to enter.", tradition: "stoic", moodTags: ["anxious", "lonely"] },
  { id: "aff-sw-7", category: "self-worth", text: "I honor myself by setting boundaries that protect my peace.", tradition: "yoga_sutras", moodTags: ["overwhelmed", "frustrated"] },
  { id: "aff-sw-8", category: "self-worth", text: "I am a soul of infinite worth, temporarily in human form.", tradition: "gita", moodTags: ["sad", "lonely", "hopeful"] },

  // LETTING GO (10) — new category from spec
  { id: "aff-lg-1", category: "letting_go", text: "I release what no longer serves me with gratitude for its lessons.", tradition: "buddhist", moodTags: ["sad", "overwhelmed"] },
  { id: "aff-lg-2", category: "letting_go", text: "Holding on is heavier than letting go.", tradition: "buddhist", moodTags: ["sad", "frustrated"] },
  { id: "aff-lg-3", category: "letting_go", text: "I surrender the outcome and trust the process.", tradition: "gita", moodTags: ["anxious", "overwhelmed"] },
  { id: "aff-lg-4", category: "letting_go", text: "I forgive, not because they deserve it, but because I deserve peace.", tradition: "buddhist", moodTags: ["angry", "frustrated", "sad"] },
  { id: "aff-lg-5", category: "letting_go", text: "I open my hands and release what I've been gripping too tightly.", tradition: "yoga_sutras", moodTags: ["anxious", "overwhelmed"] },
  { id: "aff-lg-6", category: "letting_go", text: "The past is a story I no longer need to relive.", tradition: "stoic", moodTags: ["sad", "frustrated"] },
  { id: "aff-lg-7", category: "letting_go", text: "Every exhale is practice in letting go.", tradition: "yoga_sutras", moodTags: ["anxious", "restless"] },
  { id: "aff-lg-8", category: "letting_go", text: "I am not abandoning what I release — I am making room for what is next.", tradition: "gita", moodTags: ["sad", "hopeful"] },
  { id: "aff-lg-9", category: "letting_go", text: "What is meant for me will not pass me by.", tradition: "gita", moodTags: ["anxious", "hopeful"] },
  { id: "aff-lg-10", category: "letting_go", text: "I accept what is, release what was, and trust what will be.", tradition: "stoic", moodTags: ["anxious", "overwhelmed", "hopeful"] },
];
