import { useState, useEffect, useRef } from 'react';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';

interface Price {
  price: string;
  timestamp: number;
}

export const useBinanceWebSocket = (symbol: string) => {
  const [price, setPrice] = useState<Price | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const symbolRef = useRef(symbol);

  useEffect(() => {
    let mounted = true;
    symbolRef.current = symbol;

    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const unsubscribeMsg = {
          method: 'UNSUBSCRIBE',
          params: [`${symbolRef.current.toLowerCase()}@trade`],
          id: 1,
        };
        wsRef.current.send(JSON.stringify(unsubscribeMsg));
        wsRef.current.close();
      }

      wsRef.current = new WebSocket(BINANCE_WS_URL);

      wsRef.current.onopen = () => {
        if (!mounted) return;
        
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const subscribeMsg = {
              method: 'SUBSCRIBE',
              params: [`${symbolRef.current.toLowerCase()}@trade`],
              id: 1,
            };
            wsRef.current.send(JSON.stringify(subscribeMsg));
          }
        }, 100); // Small delay to ensure connection is established
      };

      wsRef.current.onmessage = (event) => {
        if (!mounted) return;
        const data = JSON.parse(event.data);
        if (data.e === 'trade') {
          setPrice({
            price: data.p,
            timestamp: data.T,
          });
        }
      };

      wsRef.current.onclose = () => {
        if (mounted) {
          setTimeout(connectWebSocket, 3000);
        }
      };

      wsRef.current.onerror = () => {
        if (mounted && wsRef.current) {
          wsRef.current.close();
        }
      };
    };

    connectWebSocket();

    return () => {
      mounted = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol]);

  return price;
};