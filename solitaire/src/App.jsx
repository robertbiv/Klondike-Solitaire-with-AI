/**
 * App root component.
 * 
 * Sets up the necessary context providers:
 * - GameProvider: shares game state across all components
 * 
 * Layout:
 * - Full-screen dark background (slate-900)
 * - Centered game board with scrolling if needed
 * 
 * Note: DndProvider is set up in index.js (wraps entire app)
 */
import { GameProvider } from './hooks/useGame.js';
import GameBoard from './components/GameBoard.jsx';

export default function App() {
    return (
        <GameProvider>
            <div className="min-h-screen w-full flex items-start justify-center bg-slate-900 overflow-auto p-4">
              <div className="w-full">
                <GameBoard />
              </div>
            </div>
        </GameProvider>
    );
}
