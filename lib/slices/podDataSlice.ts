import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createPodDataFromAdapter,
    PacketUpdate,
    PodDataAdapter,
} from "../adapters";
import { PodData, updatePodData as updatePackets, Board } from "../models";
import { create, StateCreator, StoreApi, UseBoundStore } from "zustand";

interface PodDataSlice {
    podData: PodData
    initPodData: (podDataAdapter: PodDataAdapter) => void
    updatePodData: (newPodData: Record<number, PacketUpdate>) => void
}

export const podDataSlice: UseBoundStore<StoreApi<PodDataSlice>> = create((set, get) => ({
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
        set(state => ({
            ...state,
            podData: createPodDataFromAdapter(podDataAdapter)
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

        updatePackets(get().podData, newPodData) // TODO: CHECK THIS. IM PRETTY SURE IT DOESN'T WORKS
    },
}))