import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { MessageItem } from "./MessageItem";
import { selectMessageIds, getAllMessages } from "./messagesSlice";

import "./MessagesList.css";

interface MessagesListProps {
    chatId: string
}

export const MessagesList: React.FC<MessagesListProps> = ({ chatId }) => {
    const messageIds = useAppSelector(selectMessageIds) as string[];
    
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAllMessages(chatId));
    }, [chatId, dispatch]);

    useEffect(() => {
        const mListElement = document.getElementById("messagesList");
        if (!mListElement) return
        mListElement.scrollTop = mListElement.scrollHeight;
    }, [messageIds]);

    const renderedMessages = messageIds.map(messageId => 
        <li key={messageId}><MessageItem messageId={messageId} /> </li>
    );

    return (
        <div className="messagesList__container">
            <ul id="messagesList" className="messagesList">{renderedMessages}</ul>
        </div>
    );
}