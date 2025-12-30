import React from "react";

const FretboardView = ({ tabData, currentNoteIndex, currentMeasure }) => {
  const strings = ["G", "D", "A", "E"];
  const frets = [0, 1, 2, 3, 4, 5];

  // Get all notes for a specific string and fret from tabData
  const getNotesAtPosition = (stringName, fret) => {
    return tabData
      .map((note, idx) => ({ ...note, originalIndex: idx }))
      .filter((note) => note.string === stringName && note.fret === fret);
  };

  // Check if a position is currently active (being played)
  const isPositionActive = (stringName, fret) => {
    if (currentNoteIndex < 0) return false;
    const currentNote = tabData[currentNoteIndex];
    return currentNote?.string === stringName && currentNote?.fret === fret;
  };

  // Check if a position has any notes in the exercise
  const hasNoteAtPosition = (stringName, fret) => {
    return tabData.some(
      (note) => note.string === stringName && note.fret === fret
    );
  };

  // Get the measure color for a note position
  const getMeasureColor = (stringName, fret) => {
    const notes = getNotesAtPosition(stringName, fret);
    if (notes.length === 0) return null;
    // Check if any note in first measure (0-11)
    const hasFirstMeasure = notes.some((n) => n.originalIndex < 12);
    const hasSecondMeasure = notes.some((n) => n.originalIndex >= 12);
    if (hasFirstMeasure && hasSecondMeasure) return "both";
    if (hasFirstMeasure) return "first";
    return "second";
  };

  return (
    <div className="p-3 sm:p-6">
      {/* Fretboard Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-gold-dark)]" />
        <span className="font-semibold text-[var(--color-cream)] text-sm sm:text-base">
          Vista de Diapasón
        </span>
        <span className="text-[10px] sm:text-xs text-[var(--color-primary-light)] ml-auto uppercase tracking-wider">
          Trastes 0-5
        </span>
      </div>

      {/* Fretboard Container */}
      <div
        className="glass rounded-xl sm:rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #4a3728 0%, #3d2d22 50%, #2d1f17 100%)",
        }}
      >
        {/* Nut (Cejuela) */}
        <div className="flex">
          <div className="w-8 sm:w-12" /> {/* String label space */}
          <div
            className="flex-1 h-2 sm:h-3 bg-gradient-to-r from-[#f5f5dc] via-[#fffff0] to-[#f5f5dc]"
            style={{
              boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          />
        </div>

        {/* Fret Numbers */}
        <div className="flex border-b border-[var(--color-primary-dark)]/50">
          <div className="w-8 sm:w-12" /> {/* String label space */}
          <div className="flex-1 flex">
            {frets.map((fret) => (
              <div
                key={fret}
                className="flex-1 text-center py-1 text-[10px] sm:text-xs font-mono font-bold text-[var(--color-gold)]/70"
              >
                {fret}
              </div>
            ))}
          </div>
        </div>

        {/* Strings */}
        {strings.map((stringName, stringIndex) => (
          <div
            key={stringName}
            className="flex items-center relative"
            style={{
              height: "clamp(40px, 10vw, 56px)",
            }}
          >
            {/* String Label */}
            <div className="w-8 sm:w-12 flex items-center justify-center font-mono text-xs sm:text-sm font-bold text-[var(--color-gold)] z-10">
              {stringName}
            </div>

            {/* Frets Container */}
            <div className="flex-1 flex relative">
              {/* Actual String Line */}
              <div
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-0"
                style={{
                  height: `${3 - stringIndex * 0.5}px`,
                  background: `linear-gradient(90deg, 
                    #8b7355 0%, 
                    #c4a87c 10%, 
                    #d4b896 50%, 
                    #c4a87c 90%, 
                    #8b7355 100%)`,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              />

              {/* Fret Positions */}
              {frets.map((fret, fretIndex) => {
                const isActive = isPositionActive(stringName, fret);
                const hasNote = hasNoteAtPosition(stringName, fret);
                const measureColor = getMeasureColor(stringName, fret);

                return (
                  <div
                    key={fret}
                    className="flex-1 flex items-center justify-center relative"
                    style={{
                      borderRight:
                        fretIndex < frets.length - 1
                          ? "2px solid #888"
                          : "none",
                      boxShadow:
                        fretIndex < frets.length - 1
                          ? "inset -2px 0 4px rgba(0,0,0,0.3)"
                          : "none",
                    }}
                  >
                    {/* Fret Marker Dots (at frets 3 and 5) */}
                    {(fret === 3 || fret === 5) && stringIndex === 1 && (
                      <div
                        className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#f5f5dc]/30"
                        style={{
                          bottom: "-20px",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      />
                    )}

                    {/* Note Position Indicator */}
                    {hasNote && (
                      <div
                        className={`
                          w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center
                          font-mono text-xs sm:text-sm font-bold z-10
                          transition-all duration-150
                          ${
                            isActive
                              ? "bg-[var(--color-active)] text-[var(--color-primary-deep)] scale-110"
                              : measureColor === "first"
                              ? "bg-[var(--color-gold)]/80 text-[var(--color-primary-deep)] border-2 border-[var(--color-gold)]"
                              : measureColor === "second"
                              ? "bg-[var(--color-info)]/80 text-white border-2 border-[var(--color-info)]"
                              : "bg-gradient-to-br from-[var(--color-gold)]/60 to-[var(--color-info)]/60 text-white border-2 border-[var(--color-gold-light)]"
                          }
                        `}
                        style={{
                          boxShadow: isActive
                            ? "0 0 20px var(--color-active-glow), 0 0 40px var(--color-active-glow)"
                            : "0 2px 8px rgba(0,0,0,0.4)",
                        }}
                      >
                        {fret}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Fret Markers Row */}
        <div className="flex pb-2">
          <div className="w-8 sm:w-12" />
          <div className="flex-1 flex">
            {frets.map((fret) => (
              <div key={fret} className="flex-1 flex justify-center">
                {(fret === 3 || fret === 5) && (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#f5f5dc]/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 sm:gap-6 mt-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[var(--color-gold)]/80 border border-[var(--color-gold)]" />
          <span className="text-[10px] sm:text-xs text-[var(--color-primary-light)]">
            Emaj11
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[var(--color-info)]/80 border border-[var(--color-info)]" />
          <span className="text-[10px] sm:text-xs text-[var(--color-primary-light)]">
            Fm11
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[var(--color-active)]" />
          <span className="text-[10px] sm:text-xs text-[var(--color-primary-light)]">
            Nota Actual
          </span>
        </div>
      </div>
    </div>
  );
};

export default FretboardView;
