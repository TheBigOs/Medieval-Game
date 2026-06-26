import React, { useReducer, useCallback } from 'react';
import { GameState } from './game/types';
import { processCommand, createInitialState } from './game/engine/commands';
import StatusBar from './components/StatusBar';
import MessageLog from './components/MessageLog';
import CommandInput from './components/CommandInput';
import './App.css';

type Action =
  | { type: 'COMMAND'; payload: string }
  | { type: 'NEW_GAME' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'COMMAND':
      return processCommand(state, action.payload);
    case 'NEW_GAME':
      return createInitialState();
    default:
      return state;
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

  const isEnded = state.phase === 'game_over' || state.phase === 'victory';

  return (
    <div className="app">
      <StatusBar gameState={state} />
      <MessageLog messages={state.messages} />
      <CommandInput gameState={state} onCommand={handleCommand} />
      {isEnded && (
        <button className="new-game-btn" onClick={handleNewGame}>
          ↺ New Game
        </button>
      )}
    </div>
  );
};

export default App;
