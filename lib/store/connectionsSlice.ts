import { Connection } from "..";
import { StateCreator } from "zustand";

export interface ConnectionsSlice {
    connections: {
        backend: Connection;
        boards: Connection[];
    }
    setWebSocketConnection: (isConnected: boolean) => void;
    setConnections: (connections: Array<Connection>) => void;
}

export const connectionsSlice: StateCreator<ConnectionsSlice> = (set, get) => ({
    connections: {
        backend: { name: "Backend WebSocket", isConnected: false },
        boards: [] as Connection[],
    },

    /**
     * Reducer that sets the state of the websocket connection to isConnected param.
     * @param {boolean} isConnected
     */
    setWebSocketConnection: (isConnected: boolean) => {
        set(state => ({
            ...state,
            connections: {
                ...state.connections,
                websocket: {
                    ...state.connections.backend,
                    isConnected: isConnected
                },
                boards: state.connections.boards.map(board => ({
                    ...board,
                    isConnected: isConnected && board.isConnected
                }))
            }
        }))
    },

    /**
     * Update the board connections in the state.
     * When a board connection state changes, it updates all the connections.
     * @param {Array<Connection>} connections 
     */
    setConnections: (connections: Array<Connection>) => {
        set(state => ({
            ...state,
            boards: connections
        }))
    }
})