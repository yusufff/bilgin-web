import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (...args) => {
  const { current: socket } = useRef(io(...args));

  useEffect(() => {
    return () => {
      socket && socket.removeAllListeners();
      socket && socket.close();
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return [socket];
};