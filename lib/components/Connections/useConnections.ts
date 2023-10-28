import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useSubscribe } from "../..";
import { useStore } from "../../store/store";

export function useConnections() {
    
    const setBoardConnections = useStore(state => state.setConnections);
    const connections = useStore(state => state.connections);

    useSubscribe("connection/update", (update) => {
        setBoardConnections(update)
    });

    return connections;
}
