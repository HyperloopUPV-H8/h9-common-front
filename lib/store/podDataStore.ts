import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createPodDataFromAdapter,
    PacketUpdate,
    PodDataAdapter,
    getPacketToBoard,
    getMeasurementToPacket,
    getPackets
} from "../adapters";
import { PodData, updatePacket, Board, Packet } from "../models";
import { create, StateCreator, StoreApi, UseBoundStore } from "zustand";

export interface PodDataStore {
    podData: PodData
    initPodData: (podDataAdapter: PodDataAdapter) => void
    updatePodData: (newPodData: Record<number, PacketUpdate>) => void
}

export const usePodDataStore = create<PodDataStore>((set, get) => ({
    podData: {
        boards: [] as Board[],
        packetToBoard: {} as Record<number, number>,
        lastUpdates: {} as Record<string, PacketUpdate>,
    },

    /**
     * Reducer that initializes the state based on podDataAdapter.
     * It uses a helper function createPodDataFromAdapter to do it.
     * @param {PodDataAdapter} podDataAdapter 
     */
    initPodData: (podDataAdapter: PodDataAdapter) => {

        const boards: Board[] = Object.values(podDataAdapter.boards).map(
            (boardAdapter) => {
                const packets = getPackets(boardAdapter.name, boardAdapter.packets);
                const measurementToPacket = getMeasurementToPacket(
                    boardAdapter.packets
                );
    
                return {
                    name: boardAdapter.name,
                    packets,
                    measurementToPacket,
                };
            }
        );
    
        const packetToBoard = getPacketToBoard(podDataAdapter.boards);
    
        const podDataResult = { boards, packetToBoard, lastUpdates: {} };

        set(state => ({
            ...state,
            podData: podDataResult
        }))
    },

    /**
     * Reducer that updates the state based on newPodData.
     * @param {Record<number, PacketUpdate>} newPodData 
     */
    updatePodData: (newPodData: Record<number, PacketUpdate>) => {

        set(state => ({
            ...state,
            podData: {
                ...state.podData,
                lastUpdates: newPodData
            }
        }))

        updatePodData(get().podData, newPodData) // TODO: FIX THIS FUNCTION
    },
}))


export function updatePodData(
    podData: PodData,
    packetUpdates: { [id: number]: PacketUpdate }
) {
    for (const update of Object.values(packetUpdates)) {
        const packet = getPacket(podData, update.id);
        if (packet) {
            const boardIndex = podData.packetToBoard[update.id];

            if (boardIndex === undefined) {
                console.warn(
                    `packet with id ${update.id} not found in packetToBoard`
                );
                continue;
            }

            const board = podData.boards[boardIndex];

            if (!board) {
                console.warn(`board with index ${boardIndex} not found`);
                continue;
            }

            updatePacket(board.name, packet, update);
        } else {
            console.warn(`packet with id ${update.id} not found`);
        }
    }
}

export function getPacket(podData: PodData, id: number): Packet | undefined {
    const board = podData.boards[podData.packetToBoard[id]];

    if (board) {
        return board.packets.find((item) => item.id == id);
    }

    return undefined;
}
