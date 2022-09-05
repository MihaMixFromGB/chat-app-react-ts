import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { ChatItem } from "./ChatItem";
import {
    selectChatIds,
    selectChatsStatus,
    getAllChats,
} from "./chatsSlice";

import "./ChatsList.css";

export const ChatsList: React.FC<{}> = () => {
    const chatIds = useAppSelector(selectChatIds) as string[];
    const chatsStatus = useAppSelector(selectChatsStatus);
    
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (chatsStatus === "idle") {
            dispatch(getAllChats());
        }
    }, [chatsStatus, dispatch]);

    const renderedChats = chatIds.map(chatId => 
        <li key={chatId}>
            <ChatItem chatId={chatId} />
        </li>
    )

    return (
        <ul className="chatsList">{renderedChats}</ul>
    )
}