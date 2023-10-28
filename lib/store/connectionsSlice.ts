import { Connection } from "..";
import { StateCreator, StoreApi, UseBoundStore, create } from "zustand";

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
     * Reducer that sets the boards in the state to connections param.
     * Check if each connection already exists in boards. If so, update them.
     * If one doesn't exist, push it to boards.
     * @param {Array<Connection>} connections 
     */
    setConnections: (connections: Array<Connection>) => { 
        let finalBoards = [] as Connection[]
        let stateBoards = get().connections.boards;
        connections.forEach(connection => {
            const result = stateBoards.find(board => board.name == connection.name) //TODO: CHECK IF IT WORKS WITH FIND
            if(result) {
                finalBoards.push({
                    ...result,
                    isConnected: connection.isConnected
                })
            } else {
                finalBoards.push(connection)
            }
        })
        set(state => ({
            ...state,
            boards: finalBoards
        }))
    }
})