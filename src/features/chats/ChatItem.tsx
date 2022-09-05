import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Link, useParams } from "react-router-dom";
import classNames from "classnames";

import {
    IChat,
    selectChatById,
    updateChat,
    deleteChat
} from "./chatsSlice";

import "./ChatItem.css";

interface ChatItemProps {
    chatId: string
}

export const ChatItem: React.FC<ChatItemProps> = ({ chatId }) => {
    const chat = useAppSelector(state => selectChatById(state, chatId)) as IChat;
    const { chatId: selectedChatId } = useParams();

    const [isEdit, setIsEdit] = useState(false);
    const [newChatTitle, setNewChatTitle] = useState(chat.title);

    const dispatch = useAppDispatch();
    
    const onClickEditBtn = () => {
        if (isEdit && newChatTitle && newChatTitle !== chat.title) {
            dispatch(updateChat({
                id: chat.id,
                title: newChatTitle
            }));
        }
        
        if (!newChatTitle) setNewChatTitle(chat.title);
        setIsEdit(!isEdit);
    };
    const onNewChatTitleChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewChatTitle(event.target.value.trim());
    };
    const onClickDeleteBtn = () => {
        dispatch(deleteChat(chat.id));
    };
    
    return (
        <div className="chatItem">
            { isEdit
                ?   <input
                        type="text"
                        value={newChatTitle}
                        onChange={onNewChatTitleChanged} />
                :   <Link
                        className={classNames(
                            "text_regular",
                            { "chatItem_selected": selectedChatId === chat.id }
                        )}
                        to={`${chat.id}`}>
                            {chat.title}
                    </Link>}
            <input
                type="button"
                value="edit"
                onClick={onClickEditBtn}
                />
            <input
                type="button"
                value="-"
                onClick={onClickDeleteBtn}
                />
        </div>
    )
}