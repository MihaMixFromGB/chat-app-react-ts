import React from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Link } from "react-router-dom";

import { selectAuthUserId, signOut } from "./usersSlice";

import "./UserMenu.css";

export const UserMenu: React.FC<{}> = () => {
    const userId = useAppSelector(state => selectAuthUserId(state));
    
    const dispatch = useAppDispatch();

    const onSignOutClickBtn = () => { dispatch(signOut()) };

    return (
        <div className="userMenu">
            <label htmlFor="profileImg">
                <div className="profileImg"></div>
            </label>
            <input type="checkbox" id="profileImg" />
            <div className="userMenu__box">
                <nav>
                    <ul>
                        <li><Link className="text_regular" to={"chats"}>Chats</Link></li>
                        <li><Link className="text_regular" to={`users/${userId}`}>Profile</Link></li>
                        <li className="text_regular refElement" onClick={onSignOutClickBtn}>
                            Sign Out
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}