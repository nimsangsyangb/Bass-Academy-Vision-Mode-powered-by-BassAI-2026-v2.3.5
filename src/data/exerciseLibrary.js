/**
 * Exercise Library - Bass Trainer
 * Collection of arpeggio patterns and scales for bass practice
 */

// All notes in chromatic order (using bass-friendly positions)
export const NOTES = ['E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb'];

// Note to semitone mapping (from E = 0)
const NOTE_TO_SEMITONE = {
  'E': 0, 'F': 1, 'F#': 2, 'Gb': 2, 'G': 3, 'G#': 4, 'Ab': 4,
  'A': 5, 'A#': 6, 'Bb': 6, 'B': 7, 'C': 8, 'C#': 9, 'Db': 9,
  'D': 10, 'D#': 11, 'Eb': 11
};

// String open note semitones (from E = 0)
const STRING_SEMITONES = {
  'E': 0,
  'A': 5,
  'D': 10,
  'G': 15
};

/**
 * Exercise patterns library
 * Each pattern defines:
 * - name: Display name
 * - description: Short explanation
 * - category: Grouping category
 * - difficulty: 1-5 stars
 * - notes: Array of { interval, string } where interval is semitones from root
 * 
 * The pattern is defined for ascending then descending (like Patitucci Linear 11ths)
 */
export const PATTERNS = {
  // === Patitucci Linear 11ths Style ===
  linear11thsMaj: {
    id: 'linear11thsMaj',
    name: 'Linear 11ths (Major)',
    description: 'Arpegio Maj11 en tresillos - Estilo Patitucci',
    category: 'Patitucci',
    difficulty: 4,
    beatsPerMeasure: 4,
    notesPerBeat: 3,
    // Pattern: Root, 3rd, 5th, 7th, 9th, 11th (ascending) then descending
    // For E: E(0), G#(4), B(7), D#(11), F#(14), A(17) 
    notes: [
      // Ascending
      { interval: 0, string: 'E' },   // Root
      { interval: 4, string: 'E' },   // Major 3rd
      { interval: 7, string: 'A' },   // Perfect 5th (on A string)
      { interval: 11, string: 'D' },  // Major 7th (on D string)
      { interval: 16, string: 'D' },  // Major 9th (octave + 2)
      { interval: 17, string: 'G' },  // 11th (on G string)
      // Descending
      { interval: 17, string: 'G' },  // 11th
      { interval: 16, string: 'D' },  // 9th
      { interval: 11, string: 'D' },  // 7th
      { interval: 7, string: 'A' },   // 5th
      { interval: 4, string: 'E' },   // 3rd
      { interval: 0, string: 'E' },   // Root
    ]
  },
  
  linear11thsMin: {
    id: 'linear11thsMin',
    name: 'Linear 11ths (Minor)',
    description: 'Arpegio m11 en tresillos - Estilo Patitucci',
    category: 'Patitucci',
    difficulty: 4,
    beatsPerMeasure: 4,
    notesPerBeat: 3,
    notes: [
      // Ascending - Minor intervals
      { interval: 0, string: 'E' },   // Root
      { interval: 3, string: 'E' },   // Minor 3rd
      { interval: 7, string: 'A' },   // Perfect 5th
      { interval: 10, string: 'D' },  // Minor 7th
      { interval: 14, string: 'D' },  // Minor 9th (octave + b2)? Actually 9th is same
      { interval: 17, string: 'G' },  // 11th
      // Descending
      { interval: 17, string: 'G' },
      { interval: 14, string: 'D' },
      { interval: 10, string: 'D' },
      { interval: 7, string: 'A' },
      { interval: 3, string: 'E' },
      { interval: 0, string: 'E' },
    ]
  },

  // === Basic 7th Arpeggios ===
  maj7: {
    id: 'maj7',
    name: 'Major 7th',
    description: 'Arpegio Maj7 básico - 1, 3, 5, 7',
    category: 'Basic 7ths',
    difficulty: 2,
    beatsPerMeasure: 4,
    notesPerBeat: 3,
    notes: [
      // Ascending through octaves
      { interval: 0, string: 'E' },   // Root
      { interval: 4, string: 'E' },   // Major 3rd
      { interval: 7, string: 'A' },   // 5th
      { interval: 11, string: 'D' },  // Major 7th
      { interval: 12, string: 'D' },  // Octave
      { interval: 16, string: 'G' },  // 3rd (octave up)
      // Descending
      { interval: 16, string: 'G' },
      { interval: 12, string: 'D' },
      { interval: 11, string: 'D' },
      { interval: 7, string: 'A' },
      { interval: 4, string: 'E' },
      { interval: 0, string: 'E' },
    ]
  },

  min7: {
    id: 'min7',
    name: 'Minor 7th',
    description: 'Arpegio m7 básico - 1, b3, 5, b7',
    category: 'Basic 7ths',
    difficulty: 2,
    beatsPerMeasure: 4,
    notesPerBeat: 3,
    notes: [
      { interval: 0, string: 'E' },
      { interval: 3, string: 'E' },   // Minor 3rd
      { interval: 7, string: 'A' },
      { interval: 10, string: 'D' },  // Minor 7th
      { interval: 12, string: 'D' },
      { interval: 15, string: 'G' },  // b3 octave up
      { interval: 15, string: 'G' },
      { interval: 12, string: 'D' },
      { interval: 10, string: 'D' },
      { interval: 7, string: 'A' },
      { interval: 3, string: 'E' },
      { interval: 0, string: 'E' },
    ]
  },

  dom7: {
    id: 'dom7',
    name: 'Dominant 7th',
    description: 'Arpegio 7 - 1, 3, 5, b7',
    category: 'Basic 7ths',
    difficulty: 2,
    beatsPerMeasure: 4,
    notesPerBeat: 3,
    notes: [
      { interval: 0, string: 'E' },
      { interval: 4, string: 'E' },   // Major 3rd
      { interval: 7, string: 'A' },
      { interval: 10, string: 'D' },  // Dominant 7th (b7)
      { interval: 12, string: 'D' },
      { interval: 16, string: 'G' },
      { interval: 16, string: 'G' },
      { interval: 12, string: 'D' },
      { interval: 10, string: 'D' },
      { interval: 7, string: 'A' },
      { interval: 4, string: 'E' },
      { interval: 0, string: 'E' },
    ]
  },

  halfDim7: {
    id: 'halfDim7',
    name: 'Half Diminished',
    description: 'Arpegio m7b5 - 1, b3, b5, b7',
    category: 'Basic 7ths',
    difficulty: 3,
    beatsPerMeasure: 4,
    notesPerBeat: 3,
    notes: [
      { interval: 0, string: 'E' },
      { interval: 3, string: 'E' },   // Minor 3rd
      { interval: 6, string: 'A' },   // Diminished 5th
      { interval: 10, string: 'D' },  // Minor 7th
      { interval: 12, string: 'D' },
      { interval: 15, string: 'G' },
      { interval: 15, string: 'G' },
      { interval: 12, string: 'D' },
      { interval: 10, string: 'D' },
      { interval: 6, string: 'A' },
      { interval: 3, string: 'E' },
      { interval: 0, string: 'E' },
    ]
  },

  dim7: {
    id: 'dim7',
    name: 'Diminished 7th',
    description: 'Arpegio dim7 - 1, b3, b5, bb7',
    category: 'Basic 7ths',
    difficulty: 3,
    beatsPerMeasure: 4,
    notesPerBeat: 3,
    notes: [
      { interval: 0, string: 'E' },
      { interval: 3, string: 'E' },
      { interval: 6, string: 'A' },
      { interval: 9, string: 'D' },   // Diminished 7th (bb7)
      { interval: 12, string: 'D' },
      { interval: 15, string: 'G' },
      { interval: 15, string: 'G' },
      { interval: 12, string: 'D' },
      { interval: 9, string: 'D' },
      { interval: 6, string: 'A' },
      { interval: 3, string: 'E' },
      { interval: 0, string: 'E' },
    ]
  },

  minMaj7: {
    id: 'minMaj7',
    name: 'Minor Major 7th',
    description: 'Arpegio m(Maj7) - 1, b3, 5, 7',
    category: 'Advanced 7ths',
    difficulty: 4,
    beatsPerMeasure: 4,
    notesPerBeat: 3,
    notes: [
      { interval: 0, string: 'E' },
      { interval: 3, string: 'E' },   // Minor 3rd
      { interval: 7, string: 'A' },
      { interval: 11, string: 'D' },  // Major 7th
      { interval: 12, string: 'D' },
      { interval: 15, string: 'G' },
      { interval: 15, string: 'G' },
      { interval: 12, string: 'D' },
      { interval: 11, string: 'D' },
      { interval: 7, string: 'A' },
      { interval: 3, string: 'E' },
      { interval: 0, string: 'E' },
    ]
  },

  aug7: {
    id: 'aug7',
    name: 'Augmented 7th',
    description: 'Arpegio Maj7#5 - 1, 3, #5, 7',
    category: 'Advanced 7ths',
    difficulty: 4,
    beatsPerMeasure: 4,
    notesPerBeat: 3,
    notes: [
      { interval: 0, string: 'E' },
      { interval: 4, string: 'E' },
      { interval: 8, string: 'A' },   // Augmented 5th
      { interval: 11, string: 'D' },
      { interval: 12, string: 'D' },
      { interval: 16, string: 'G' },
      { interval: 16, string: 'G' },
      { interval: 12, string: 'D' },
      { interval: 11, string: 'D' },
      { interval: 8, string: 'A' },
      { interval: 4, string: 'E' },
      { interval: 0, string: 'E' },
    ]
  },
};

// Categories for grouping in UI
// type: 'artist' shows artist name in header, 'difficulty' shows difficulty level
export const CATEGORIES = [
  { 
    id: 'Patitucci', 
    name: 'Patitucci Linear 11ths', 
    icon: '🎸',
    type: 'artist',
    artist: 'John Patitucci',
    subtitle: 'Modern Jazz Bass Technique'
  },
  { 
    id: 'Basic 7ths', 
    name: 'Basic 7th Arpeggios', 
    icon: '🎵',
    type: 'difficulty',
    artist: null,
    subtitle: 'Fundamental Arpeggio Training'
  },
  { 
    id: 'Advanced 7ths', 
    name: 'Advanced 7th Arpeggios', 
    icon: '⭐',
    type: 'difficulty',
    artist: null,
    subtitle: 'Extended Harmony Studies'
  },
];

/**
 * Generate tab data from a pattern and root note
 * @param {string} patternId - The pattern ID from PATTERNS
 * @param {string} rootNote - The root note (e.g., 'E', 'F#', 'Bb')
 * @returns {Array} - Array of { string, fret, id } for tablature display
 */
export function generateTabData(patternId, rootNote) {
  const pattern = PATTERNS[patternId];
  if (!pattern) {
    console.error(`Pattern ${patternId} not found`);
    return [];
  }

  const rootSemitone = NOTE_TO_SEMITONE[rootNote] || 0;

  return pattern.notes.map((note, index) => {
    const targetSemitone = rootSemitone + note.interval;
    const stringSemitone = STRING_SEMITONES[note.string];
    const fret = targetSemitone - stringSemitone;

    // If fret is negative, we need to use a different string
    // For now, just clamp to valid fret range
    const adjustedFret = Math.max(0, Math.min(24, fret));

    return {
      string: note.string,
      fret: adjustedFret,
      id: index
    };
  });
}

/**
 * Get pattern info for display
 * @param {string} patternId 
 * @returns {Object} Pattern metadata
 */
export function getPatternInfo(patternId) {
  return PATTERNS[patternId] || null;
}

/**
 * Get all patterns grouped by category
 * @returns {Object} Patterns grouped by category
 */
export function getPatternsByCategory() {
  const grouped = {};
  
  Object.values(PATTERNS).forEach(pattern => {
    if (!grouped[pattern.category]) {
      grouped[pattern.category] = [];
    }
    grouped[pattern.category].push(pattern);
  });

  return grouped;
}

/**
 * Get the display name for a root note with proper accidentals
 * @param {string} note 
 * @returns {string}
 */
export function formatNoteName(note) {
  return note.replace('#', '♯').replace('b', '♭');
}

/**
 * Get category info from a pattern ID
 * @param {string} patternId 
 * @returns {Object} Category metadata including artist info
 */
export function getCategoryInfo(patternId) {
  const pattern = PATTERNS[patternId];
  if (!pattern) return null;
  
  return CATEGORIES.find(cat => cat.id === pattern.category) || null;
}

/**
 * Get header info based on selected patterns
 * Returns artist name if both patterns are from same artist, otherwise difficulty info
 * @param {string} pattern1Id 
 * @param {string} pattern2Id 
 * @returns {Object} { displayName, subtitle, type }
 */
export function getHeaderInfo(pattern1Id, pattern2Id) {
  const cat1 = getCategoryInfo(pattern1Id);
  const cat2 = getCategoryInfo(pattern2Id);
  
  // If both patterns are from the same artist category
  if (cat1 && cat2 && cat1.type === 'artist' && cat1.id === cat2.id) {
    return {
      displayName: cat1.artist,
      subtitle: cat1.subtitle,
      type: 'artist'
    };
  }
  
  // If at least one is artist-based, show that artist
  if (cat1?.type === 'artist') {
    return {
      displayName: cat1.artist,
      subtitle: cat1.subtitle,
      type: 'artist'
    };
  }
  
  if (cat2?.type === 'artist') {
    return {
      displayName: cat2.artist,
      subtitle: cat2.subtitle,
      type: 'artist'
    };
  }
  
  // Otherwise show difficulty-based header
  const pattern1 = PATTERNS[pattern1Id];
  const avgDifficulty = pattern1 ? pattern1.difficulty : 3;
  const difficultyLabel = avgDifficulty <= 2 ? 'Beginner' : avgDifficulty <= 3 ? 'Intermediate' : 'Advanced';
  
  return {
    displayName: `${difficultyLabel} Practice`,
    subtitle: cat1?.subtitle || 'Arpeggio Training',
    type: 'difficulty',
    difficulty: avgDifficulty
  };
}

/**
 * Default exercise configuration
 */
export const DEFAULT_EXERCISE = {
  patternId: 'linear11thsMaj',
  rootNote: 'E',
  secondPatternId: 'linear11thsMin', 
  secondRootNote: 'F'
};
