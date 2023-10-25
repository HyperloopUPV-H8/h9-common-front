import { Measurement } from "../models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    getBooleanMeasurement,
    getEnumMeasurement,
    getNumericMeasurement,
    isNumericAdapter,
    PodDataAdapter,
    PacketUpdate,
} from "../adapters";
import { StateCreator } from "zustand";

export type Measurements = {
    measurements: Record<string, Measurement>;
    packetIdToBoard: Record<number, string>;
};

export const measurementsSliceRedux = createSlice({
    name: "measurements",
    initialState: { measurements: {}, packetIdToBoard: {} } as Measurements,
    reducers: {
        initMeasurements: (
            _: Measurements,
            action: PayloadAction<PodDataAdapter>
        ) => {
            return {
                measurements: createMeasurementsFromPodDataAdapter(
                    action.payload
                ),
                packetIdToBoard: getPacketIdToBoard(action.payload),
            };
        },
        updateMeasurements: (
            state: Measurements,
            action: PayloadAction<Record<string, PacketUpdate>>
        ) => {
            for (const update of Object.values(action.payload)) {
                for (const [id, mUpdate] of Object.entries(
                    update.measurementUpdates
                )) {
                    const boardName = state.packetIdToBoard[update.id];

                    if (!boardName) {
                        continue;
                    }

                    const measId = `${boardName}/${id}`;
                    state.measurements[measId].value = mUpdate;
                }
            }
        },
    },
});

interface MeasurementsSlice {
    measurements: Record<string, Measurement>;
    packetIdToBoard: Record<number, string>;
    initMeasurements: (podDataAdapter: PodDataAdapter) => Measurements;
    updateMeasurements: (measurements: Record<string, PacketUpdate>) => void
}

const measurementsSlice: StateCreator<MeasurementsSlice> = (set, get) => ({
    measurements: {},
    packetIdToBoard: {},

    /**
     * Reducer that receives a PodDataAdapter and initializes the measurements
     * and packetIdToBoard map in state.
     * @param {PodDataAdapter} podDataAdapter 
     * @returns {Measurements}
     */
    initMeasurements: (podDataAdapter: PodDataAdapter) => {

        const measurements: Measurements = {
            measurements: createMeasurementsFromPodDataAdapter(podDataAdapter),
            packetIdToBoard: getPacketIdToBoard(podDataAdapter),
        }

        set(state => ({
            ...state,
            ...measurements
        }))

        return measurements
    },

    /**
     * Reducer that updates the measurements in the state.
     * It receives a measurements map with PacketUpdates, extract the measurements
     * from each of them and updates the measurements.
     * @param {Record<string, PacketUpdate>} measurements 
     */
    updateMeasurements: (measurements: Record<string, PacketUpdate>) => {
        for(const update of Object.values(measurements)) {
            for (const [id, mUpdate] of Object.entries(update.measurementUpdates)) {
                const boardName = get().packetIdToBoard[update.id];
                if (!boardName) {
                    continue;
                }

                const measurementId = `${boardName}/${id}`;
                set(state => ({
                    ...state,
                    measurements: {
                        ...measurements,
                        [measurementId]: {
                            ...state.measurements[measurementId],
                            value: mUpdate
                        }
                    }
                } as MeasurementsSlice))
            }
        }
    }
})

function createMeasurementsFromPodDataAdapter(
    podDataAdapter: PodDataAdapter
): Record<string, Measurement> {
    const measurements: Record<string, Measurement> = {};

    for (const board of Object.values(podDataAdapter.boards)) {
        for (const packet of Object.values(board.packets)) {
            for (const adapter of Object.values(packet.measurements)) {
                const id = `${board.name}/${adapter.id}`;
                if (isNumericAdapter(adapter)) {
                    measurements[id] = getNumericMeasurement(id, adapter);
                } else if (adapter.type == "bool") {
                    measurements[id] = getBooleanMeasurement(id, adapter);
                } else {
                    measurements[id] = getEnumMeasurement(id, adapter);
                }
            }
        }
    }

    return measurements;
}

function getPacketIdToBoard(podData: PodDataAdapter) {
    const packetIdToBoard = {} as Record<number, string>;

    for (const board of Object.values(podData.boards)) {
        for (const packet of Object.values(board.packets)) {
            packetIdToBoard[packet.id] = board.name;
        }
    }

    return packetIdToBoard;
}

export function getMeasurement(
    measurements: Measurements,
    id: string
): Measurement | undefined {
    const meas = measurements.measurements[id];

    if (!meas) {
        console.trace(`measurement ${id} not found in store`);
        return undefined;
    }

    return meas;
}

export function getMeasurementFallback(
    measurements: Measurements,
    id: string
): Measurement {
    return (
        getMeasurement(measurements, id) ?? {
            id: "Default",
            name: "Default",
            safeRange: [null, null],
            warningRange: [null, null],
            type: "uint8",
            units: "A",
            value: { average: 0, last: 0 },
        }
    );
}
