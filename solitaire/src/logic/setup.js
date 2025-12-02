/**
 * Create a standard 52-card deck.
 * Each card starts face-down and unassigned (no column/index yet).
 * Cards get unique IDs for React key prop stability.
 */
function makeDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['ace','2','3','4','5','6','7','8','9','10','jack','queen','king'];
    const deck = [];
    let id = 1;
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ id: id++, suit, rank, faceUp: false, index: null, columnIndex: null });
        }
    }
    return deck;
}

/**
 * Shuffle an array in place using Fisher-Yates algorithm.
 * Each position randomly swaps with a position before it.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Initialize a fresh Klondike Solitaire game.
 * Returns the starting state:
 * - tableaus: 7 columns with 1,2,3...7 cards (only top card face-up)
 * - foundations: 4 empty piles (will build A→K by suit)
 * - stock: remaining cards (face-down draw pile)
 * - waste: empty (discarded cards from stock)
 */
export function initGame() {
    const deck = shuffle(makeDeck());

    // Deal tableau: column i gets i+1 cards (column 0 gets 1, column 6 gets 7)
    const tableaus = Array.from({ length: 7 }, () => []);
    let offset = 0;
    for (let col = 0; col < 7; col++) {
        for (let i = 0; i <= col; i++) {
            const card = deck[offset++];
            card.columnIndex = col;
            card.index = i;
            card.faceUp = (i === col); // only the last card in each column is face-up
            tableaus[col].push(card);
        }
    }

    // Remaining cards go to stock pile
    const stock = deck.slice(offset).map((c) => ({ ...c }));
    const waste = [];

    // Four foundation piles start empty
    const foundations = Array.from({ length: 4 }, () => []);

    return { tableaus, foundations, stock, waste };
}

export default initGame;
