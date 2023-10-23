import { Connection } from "..";
import { StateCreator } from "zustand";

interface ConnectionsSlice {
    websocket: Connection;
    boards: Connection[];
    setWebSocketConnection: (isConnected: boolean) => void;
    setBoardConnections: (connections: Array<Connection>) => void;
}

const connectionsSlice: StateCreator<ConnectionsSlice> = (set, get) => ({
    websocket: { name: "Backend WebSocket", isConnected: false },
    boards: [] as Connection[],

    /**
     * Reducer that sets the state of the connection to isConnected param.
     * @param {boolean} isConnected
     */
    setWebSocketConnection: (isConnected: boolean) => {
        if(!isConnected) {
            set(state => ({
                websocket: {
                    ...state.websocket,
                    isConnected: false
                },
                boards: state.boards.map(board => ({
                    ...board,
                    isConnected: false
                }))
            }))
        } else {
            set(state => ({
                websocket: {
                    ...state.websocket,
                    isConnected: true
                }
            }))
        }
    },

    /**
     * Reducer that sets the boards in the state to connections param.
     * Check if each connection already exists in boards. If so, update them.
     * If one doesn't exist, push it to boards.
     * @param {Array<Connection>} connections 
     */
    setBoardConnections: (connections: Array<Connection>) => { 
        let finalBoards = [] as Connection[]
        let stateBoards = get().boards;
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