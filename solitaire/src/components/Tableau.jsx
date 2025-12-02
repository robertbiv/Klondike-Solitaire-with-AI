/**
 * Tableau column: one of the seven main play columns.
 * 
 * Features:
 * - Accepts card drops following Klondike rules (alternating colors, descending)
 * - Green ring when AI suggests this as destination
 * - Dynamically adjusts card spacing to prevent vertical overflow
 * - Cards stack with visible overlap so you can see all ranks
 * 
 * The vertical spacing (cardOffset) shrinks automatically if the column
 * gets too tall for the viewport.
 */
import { useCallback, useMemo, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../dndTypes.js";
import Card from "./Card.jsx"; 
import { canPlace } from "../logic/rules.js";
import { useGame } from "../hooks/useGame.js";

export default function Tableau({ cards, colIndex }) {
    const { moveCards, moveWasteToTableau, currentSuggestion } = useGame();

    const canDropCard = useCallback((item) => canPlace(item.card, cards), [cards]); // basic rule check

    const handleDrop = useCallback((item, monitor) => {
        if (!monitor.canDrop()) return;
        
        if (item.fromWaste) {
            moveWasteToTableau(colIndex);
        } else if (item.fromColumn !== undefined && item.fromIndex !== undefined) {
            moveCards(item.fromColumn, item.fromIndex, colIndex);
        }
    }, [colIndex, moveCards, moveWasteToTableau]);

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,
        canDrop: canDropCard,
        drop: handleDrop,
        collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
    }), [canDropCard, handleDrop]);

    const isSuggestedDestination = useMemo(() => {
        if (!currentSuggestion) return false;
        if (currentSuggestion.type === 'tableau-to-tableau' && currentSuggestion.toColumn === colIndex) return true;
        if (currentSuggestion.type === 'tableau-stack-to-tableau' && currentSuggestion.toColumn === colIndex) return true;
        if (currentSuggestion.type === 'waste-to-tableau' && currentSuggestion.toColumn === colIndex) return true;
        return false;
    }, [currentSuggestion, colIndex]);

    const highlightClass = isSuggestedDestination ? 'ring-4 ring-emerald-400 animate-pulse' : ''; // green ring = AI target

    // Dynamic vertical spacing to prevent overflow
    const [cardOffset, setCardOffset] = useState(18);

    useEffect(() => {
        // Calculate available height for tableau
        const viewportHeight = window.innerHeight;
        const availableHeight = viewportHeight * 0.7; // Use 70% of viewport for tableau area
        const cardHeight = 120; // Base card height in pixels
        
        if (cards.length > 0) {
            // Calculate needed height with full 18px offset
            const fullHeight = cardHeight + (cards.length - 1) * 18;
            
            // If it exceeds available space, compress the offset
            if (fullHeight > availableHeight) {
                const newOffset = Math.max(10, (availableHeight - cardHeight) / (cards.length - 1));
                setCardOffset(Math.floor(newOffset));
            } else {
                setCardOffset(18); // Reset to default when there's space
            }
        }
    }, [cards.length]);

    // Calculate dynamic height based on current offset
    const columnHeight = cards.length > 0 ? `${cards.length * cardOffset + 120}px` : '6rem';

    return (
        <div
            ref={drop}
            style={{ minHeight: columnHeight }}
            className={`relative w-16 sm:w-18 md:w-20 lg:w-24 xl:w-28 rounded-md border-2 ${isOver && canDrop ? 'border-green-500' : 'border-transparent'} ${highlightClass}`}>
            {cards.map((c, i) => (
                <Card key={c.id} card={c} colIndex={colIndex} cardIndex={i} style={{ top: `${i * cardOffset}px`, zIndex: i }} />
            ))}
        </div>
    );
}