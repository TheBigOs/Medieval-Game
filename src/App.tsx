import React, { useReducer, useCallback, useState, useEffect, useRef } from 'react';
import { GameState } from './game/types';
import { processCommand, createInitialState, returnToCheckpoint } from './game/engine/commands';
import { getT } from './game/i18n';
import StatusBar from './components/StatusBar';
import MessageLog from './components/MessageLog';
import CommandInput from './components/CommandInput';
import InventoryHUD from './components/InventoryHUD';
import './App.css';

type Action =
  | { type: 'COMMAND'; payload: string }
  | { type: 'NEW_GAME' }
  | { type: 'CHECKPOINT' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'COMMAND':   return processCommand(state, action.payload);
    case 'NEW_GAME':  return createInitialState();
    case 'CHECKPOINT': return returnToCheckpoint(state);
    default:          return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const handleCommand = useCallback((cmd: string) => {
    dispatch({ type: 'COMMAND', payload: cmd });
  }, []);

  const handleNewGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME' });
  }, []);

  const handleCheckpoint = useCallback(() => {
    dispatch({ type: 'CHECKPOINT' });
  }, []);

  // Combat flash overlay
  const [combatFlash, setCombatFlash] = useState<{ type: 'hit' | 'miss'; id: number } | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashId = useRef(0);
  const prevMsgCount = useRef(0);

  useEffect(() => {
    const newMsgs = state.messages.slice(prevMsgCount.current);
    prevMsgCount.current = state.messages.length;
    for (const m of newMsgs) {
      if (m.type === 'player-hit' || m.type === 'player-miss') {
        if (flashTimer.current) clearTimeout(flashTimer.current);
        flashId.current += 1;
        setCombatFlash({ type: m.type === 'player-hit' ? 'hit' : 'miss', id: flashId.current });
        flashTimer.current = setTimeout(() => setCombatFlash(null), 750);
        break;
      }
    }
  }, [state.messages]);

  const isEnded = state.phase === 'game_over' || state.phase === 'victory';
  const T = getT(state.language);

  return (
    <div className="app">
      <StatusBar gameState={state} />
      <div className="content-area">
        <MessageLog messages={state.messages} />
        <InventoryHUD gameState={state} />
        {combatFlash && (
          <div key={combatFlash.id} className={`combat-flash combat-flash-${combatFlash.type}`}>
            {combatFlash.type === 'hit' ? 'HIT!' : 'MISS'}
          </div>
        )}
      </div>
      <CommandInput gameState={state} onCommand={handleCommand} />
      {isEnded && (
        <div className="end-buttons">
          {state.phase === 'game_over' && state.checkpoint && (
            <button className="checkpoint-btn" onClick={handleCheckpoint}>
              {T.checkpoint.returnBtn}
            </button>
          )}
          <button className="new-game-btn" onClick={handleNewGame}>
            ↺ New Game
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
