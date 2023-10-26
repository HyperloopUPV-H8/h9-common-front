import { useDispatch, useSelector } from "react-redux";
import { Message, MessageAdapter, useSubscribe } from "../..";
import { useStore } from "../../store/store";

export function useMessages() {
    
    const addMessage = useStore((state) => state.addMessage);
    const messages = useStore((state) => state.messages);

    useSubscribe("message/update", (msg: MessageAdapter) => {
        addMessage(msg);
    });

    return messages;
}
