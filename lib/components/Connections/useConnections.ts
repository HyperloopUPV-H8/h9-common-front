import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useSubscribe } from "../..";
import { connectionsSlice } from "../../store/connectionsSlice";
import { useStore } from "zustand";

export function useConnections() {
    
    const {setBoardConnections, connections} = connectionsSlice()

    useSubscribe("connection/update", (update) => {
        setBoardConnections(update)
    });

    return connections;
}
