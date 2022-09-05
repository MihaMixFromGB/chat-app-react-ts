import React from "react";
import { useAppSelector } from "../../app/hooks";
import { parseISO, format } from "date-fns";
import classNames from "classnames";

import "./MessageItem.css";
import { IMessage, selectMessageById } from "./messagesSlice";
import { selectUserNicknameById, selectAuthUserId } from "../users";

interface MessageItemProps {
    messageId: string
}

export const MessageItem: React.FC<MessageItemProps> = ({ messageId }) => {
    const message = useAppSelector(state => selectMessageById(state, messageId)) as IMessage;
    const nickname = useAppSelector(state => selectUserNicknameById(state, message.user));
    const authUserId = useAppSelector(state => selectAuthUserId(state));

    return (
        <div className={classNames(
            "message__container",
            {
                "message_toRight": authUserId === message.user
            }
        )}>
            <p className="message_author text_light">
                {nickname}
            </p>
            <p className="message_text text_regular">
                {message.text}
            </p>
            <p className="message_date text_light">
                {format(parseISO(message.date), "dd-MM-yyyy HH:mm:ss")}
            </p>
        </div>
    )
}