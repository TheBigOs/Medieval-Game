import React, { useReducer, useCallback } from 'react';
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

  const isEnded = state.phase === 'game_over' || state.phase === 'victory';
  const T = getT(state.language);

  return (
    <div className="app">
      <StatusBar gameState={state} />
      <div className="content-area">
        <MessageLog messages={state.messages} />
        <InventoryHUD gameState={state} />
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
