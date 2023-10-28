import { nanoid } from "nanoid";
import { isEqual } from "lodash";
import { MessageAdapter } from "../adapters";
import { Message } from "../models";
import { StateCreator, StoreApi, UseBoundStore, create } from "zustand";

export interface MessagesSlice {
    messages: Array<Message>
    addMessage: (message: MessageAdapter) => Array<Message>
    clearMessages: () => void
}

export const messagesSlice: StateCreator<MessagesSlice> = (set, get) => ({
    messages: [] as Array<Message>,

    /**
     * Reducer that adds to messages the message resulted of processing the MessageAdapter
     * @param {MessageAdapter} message 
     * @returns {Array<Message>}
     */
    addMessage: (message: MessageAdapter) => {
        
        const preparedMessage = {
            id: nanoid(),
            count: 1,
            ...message
        } as Message

        if(get().messages.length > 0 && areMessagesEqual(get().messages[get().messages.length - 1], preparedMessage)) {
            set(state => ({
                ...state,
                messages: [
                    ...state.messages.slice(0, state.messages.length - 1),
                    {
                        ...state.messages[state.messages.length - 1],
                        id: preparedMessage.id,
                        count: state.messages[state.messages.length - 1].count + 1
                    }
                ]
            }))
        } else {
            set(state => ({
                ...state,
                messages: [...state.messages, preparedMessage] as Array<Message>
            }))
        }

        return [...get().messages, preparedMessage]
    },

    clearMessages: () => {
        set(state => ({
            ...state,
            messages: []
        }))
    }
})

function areMessagesEqual(message: Message, adapter: MessageAdapter): boolean {
    if (
        message.board == adapter.board &&
        message.kind == adapter.kind &&
        message.name == adapter.name
    ) {
        return message.payload == adapter.payload;
    }

    return false;
}
