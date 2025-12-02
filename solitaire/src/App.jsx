import { GameProvider } from './hooks/useGame.js';
import GameBoard from './components/GameBoard.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRef } from 'react';
import useScaleToFit from './hooks/useScaleToFit.js';

export default function App() {
    const boardRef = useRef(null);
    const scale = useScaleToFit(boardRef, { padding: 24, maxScale: 1 });
    return (
        <DndProvider backend={HTML5Backend}>
            <GameProvider>
                <div className="min-h-screen w-full flex items-start justify-center bg-slate-900 overflow-x-hidden">
                  <div ref={boardRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }} className="p-4 md:p-6 rounded-xl bg-white shadow-xl max-w-full">
                    <p className="mb-4 text-xl font-bold text-slate-800">Solitaire</p>
                    <GameBoard />
                  </div>
                </div>
            </GameProvider>
        </DndProvider>
    );
}
