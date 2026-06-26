import React, { useEffect, useRef } from 'react';
import { GameMessage } from '../game/types';

interface Props {
  messages: GameMessage[];
}

const MessageLog: React.FC<Props> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-log">
      {messages.map(m => (
        <div key={m.id} className={`msg msg-${m.type}`}>
          {m.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageLog;
