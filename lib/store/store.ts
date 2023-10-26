import { StoreApi, UseBoundStore, create } from "zustand";
import { connectionsSlice, ConnectionsSlice,
         messagesSlice, MessagesSlice,
         measurementsSlice, MeasurementsSlice,
         ordersSlice, OrdersSlice,
         podDataSlice, PodDataSlice } from "./";

type Store = ConnectionsSlice & MessagesSlice & MeasurementsSlice & OrdersSlice & PodDataSlice;

const store = create<Store>((...a) => ({
    ...connectionsSlice(...a),
    ...messagesSlice(...a),
    ...measurementsSlice(...a),
    ...ordersSlice(...a),
    ...podDataSlice(...a),
}))