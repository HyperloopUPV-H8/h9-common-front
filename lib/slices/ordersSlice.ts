import { StateCreator } from "zustand";
import { BoardOrders, StateOrdersUpdate, VehicleOrders } from "..";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const orderSliceRedux = createSlice({
    name: "orders",
    initialState: {
        boards: [],
    } as VehicleOrders,
    reducers: {
        setOrders: (_, action: PayloadAction<VehicleOrders>) => {
            return action.payload;
        },
        updateStateOrders: (
            state,
            action: PayloadAction<StateOrdersUpdate>
        ) => {
            Object.entries(action.payload).forEach(([name, ids]) => {
                const index = state.boards.findIndex(
                    (board) => board.name == name
                );

                if (index == -1) {
                    return;
                }

                state.boards[index].stateOrders = state.boards[index].stateOrders.map((item) => {
                    return {
                        ...item,
                        enabled: ids.includes(item.id),
                    };
                });
            });
        },
    },
});

interface OrdersSlice {
    vehicleOrders: VehicleOrders
    setOrders: (vehicleOrders: VehicleOrders) => void
    updateStateOrders: (stateOrdersUpdate: StateOrdersUpdate) => void
}

export const ordersSlice: StateCreator<OrdersSlice> = (set, get) => ({
    vehicleOrders: { boards: [] },

    setOrders: (vehicleOrders: VehicleOrders) => {
        set(state => ({
            ...state,
            vehicleOrders: vehicleOrders
        }))
    },

    updateStateOrders: (stateOrdersUpdate: StateOrdersUpdate) => {
        Object.entries(stateOrdersUpdate).forEach(([name, ids]) => {
            const index = get().vehicleOrders.boards.findIndex( (board) => board.name == name );
            if (index == -1) return

            set(state => ({
                ...state,
                vehicleOrders: {
                    ...state.vehicleOrders,
                    boards: {
                        ...state.vehicleOrders.boards,
                        [index]: {
                            ...state.vehicleOrders.boards[index],
                            stateOrders: state.vehicleOrders.boards[index].stateOrders.map(item => {
                                return {
                                    ...item,
                                    enabled: ids.includes(item.id),
                                };
                            }),
                        }
                    }
                }
            } as OrdersSlice))
        })
    },
})
