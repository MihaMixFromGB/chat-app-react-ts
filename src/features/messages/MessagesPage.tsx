import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { MessagesList } from "./MessagesList";
import { addMessage } from "./messagesSlice";
import { selectAuthUserId } from "../users";

import "./MessagesPage.css";

interface MessagesPageProps {
    chatId: string
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ chatId }) => {
    const authUserId = useAppSelector(state => selectAuthUserId(state));
    
    const [newMessage, setNewMessage] = useState("");

    const dispatch = useAppDispatch();

    const onChangeNewMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(event.target.value);
    };
    const onEnterNewMessage = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            addNewMessage();
        }
    };

    const addNewMessage = () => {
        if (!newMessage) return;

        dispatch(addMessage({
            chatId,
            userId: authUserId,
            text: newMessage
        }));

        setNewMessage("");
    };

    return (
        <div className="messages__container">
            <MessagesList chatId={chatId} />
            <div className="messages_toolbar">
                <input
                    type="text"
                    value={newMessage}
                    placeholder="Write a message..."
                    onChange={onChangeNewMessage}
                    onKeyUp={onEnterNewMessage} />
                <input
                    type="button"
                    value="+"
                    onClick={addNewMessage} />
            </div>
        </div>
    )
};