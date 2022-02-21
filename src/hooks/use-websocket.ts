import { CWebSocket } from "../interfaces/websockets/cwebsocket";
import Message from "../interfaces/websockets/message";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import jsonUtils from "../utils/json-utils";
import { v4 } from "uuid";
import { QueryClient, useQueryClient } from "react-query";
import { request } from "http";
import { GetRequestsResponse } from "../interfaces/get-requests-response";

const heartbeat = (
  ws: CWebSocket,
  timeoutRef: MutableRefObject<NodeJS.Timeout | null>
) => {
  timeoutRef.current && clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => {
    ws.close();
  }, 5000 + 1000);
};

const onClose = (timeoutRef: MutableRefObject<NodeJS.Timeout | null>) => () => {
  console.log("on close");
  timeoutRef.current && clearTimeout(timeoutRef.current);
};

const onMessage =
  (
    ws: WebSocket,
    timeoutRef: MutableRefObject<NodeJS.Timeout | null>,
    qc: QueryClient
  ) =>
  (ev: MessageEvent<any>) => {
    if (ev.data === undefined) {
      return;
    }
    const [error, contents] = jsonUtils.parseJSON<Message>(ev.data);
    if (error != null || contents == null) {
      console.error("parse-error", "failed to parse message");
      console.error(error);
      return;
    }
    switch (contents.type) {
      case "heartbeat":
        console.log("heartbeat");
        const payload = JSON.stringify({ type: "heartbeat" });
        ws.send(payload);
        heartbeat(ws, timeoutRef);
        break;
      case "insert": {
        const { payload } = contents;
        qc.setQueryData<GetRequestsResponse | undefined>(["requests"], (pv) => {
          if (pv === undefined) {
            return undefined;
          }
          const hasEntry = pv[payload.key] !== undefined;
          return {
            ...pv,
            [payload.key]: hasEntry ? [...pv[payload.key], payload] : [payload],
          };
        });
        break;
      }
      case "update":
        const { payload: pl } = contents;
        console.log(pl);
        qc.setQueryData<GetRequestsResponse | undefined>(["requests"], (pv) => {
          if (pv === undefined || pv[pl.key] === undefined) {
            return undefined;
          }
          return {
            ...pv,
            [pl.key]: pv[pl.key].map((r) => (r._id === pl._id ? pl : r)),
          };
        });
        break;
      default:
        console.log(contents);
        break;
    }
  };

const onOpen =
  (ws: CWebSocket, timeoutRef: MutableRefObject<NodeJS.Timeout | null>) =>
  () => {
    console.log("on open");
    const payload: Message = {
      type: "register",
      payload: v4(),
    };
    ws.send(JSON.stringify(payload));
    ws.uuid = payload.payload;
    heartbeat(ws, timeoutRef);
  };

const wsUrl = (import.meta.env.VITE_WS_URL as string | undefined) ?? "";

const useWebSocket = () => {
  const wsRef = useRef<CWebSocket | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (!wsRef.current) {
      const wss: CWebSocket = new WebSocket(wsUrl);
      wss.onopen = onOpen(wss, timeoutRef);
      wss.onmessage = onMessage(wss, timeoutRef, qc);
      wss.onclose = onClose(timeoutRef);
      wsRef.current = wss;
    }
  }, [qc]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.CLOSED) {
        console.log("reconnect");
        const wss = new WebSocket(wsUrl);
        wss.onopen = onOpen(wss, timeoutRef);
        wss.onmessage = onMessage(wss, timeoutRef, qc);
        wss.onclose = onClose(timeoutRef);
        wsRef.current = wss;
      }
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [qc]);

  const getWebSocketId = useCallback(() => {
    return wsRef.current?.uuid;
  }, []);

  const sendMessage = useCallback((msg: Message) => {
    wsRef.current && wsRef.current.send(JSON.stringify(msg));
  }, []);

  return {
    getWebSocketId,
    sendMessage,
  };
};

export default useWebSocket;
