import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useSubscribe } from "../..";
import { connectionsSlice } from "../../slices/connectionsSlice";
import { useStore } from "zustand";

export function useConnections() {
    
    const {setBoardConnections, connections} = connectionsSlice()

    useSubscribe("connection/update", (update) => {
        setBoardConnections(update)
    });

    return connections;
}
