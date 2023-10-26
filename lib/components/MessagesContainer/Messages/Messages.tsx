import { clear } from "console";
import { Button, Message } from "../../..";
import { useStore } from "../../../store/store";
import styles from "./Messages.module.scss";
import { MessageView } from "./MessageView/MessageView";
import { useAutoScroll } from "./useAutoScroll";
import { useDispatch } from "react-redux";

type Props = {
    messages: Message[];
};

export const Messages = ({ messages }: Props) => {
    const { ref, handleScroll } = useAutoScroll(messages);
    
    const clearMessages = useStore((state) => state.clearMessages);

    return (
        <section className={styles.messagesWrapper}>
            <section
                ref={ref}
                onScroll={handleScroll}
                className={styles.messages}
            >
                {messages.map((message) => {
                    return (
                        <MessageView
                            key={message.id}
                            message={message}
                        />
                    );
                })}
            </section>
            <div className={styles.buttons}>
                <Button
                    className={styles.clearBtn}
                    label="To bottom"
                    color="#adadad"
                    onClick={() =>
                        ref.current?.scrollTo({ top: ref.current.scrollHeight })
                    }
                />
                <Button
                    className={styles.clearBtn}
                    label="Clear"
                    onClick={() =>
                        clearMessages()
                    }
                />
            </div>
        </section>
    );
};
