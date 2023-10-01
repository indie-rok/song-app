export const CHORDS = [
    ["C4", "E4", "G4"],
    ["A4", "C5", "E5"],
    ["F4", "A4", "C5"],
    ["G4", "B4", "D5"],
];

export function getChordIndex(chord) {
    for (let i = 0; i < CHORDS.length; i++) {
        if (JSON.stringify(chord) === JSON.stringify(CHORDS[i])) {
            return i;
        }
    }
    return -1;  // Return -1 if chord is not found
}
