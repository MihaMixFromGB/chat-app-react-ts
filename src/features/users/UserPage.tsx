import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useParams } from "react-router-dom";

import {
    IProfile,
    selectUserById,
    updateProfile
} from "./usersSlice";

import "./UserPage.css";

type UserParams = {
    userId: string
}

export const UserPage: React.FC<{}> = () => {
    const { userId } = useParams<UserParams>();
    const user = useAppSelector(state => selectUserById(state, userId || "")) as IProfile;

    const [firstname, setFirstname] = useState(user.firstname);
    const [lastname, setLastname] = useState(user.lastname);
    const [nickname, setNickname] = useState(user.nickname);

    const [isVisibleEditForm, setIsVisibleEditForm] = useState(false);

    const dispatch = useAppDispatch();

    const updateUser = () => {
        if (user && firstname && lastname && nickname) {
            dispatch(updateProfile({
                id: user.id,
                firstname,
                lastname,
                nickname,
                email: user.email
            }));
        }
        setIsVisibleEditForm(false);
    };

    return (
        <div className="profile__container text_regular">
            <img src="/profile.png" alt="My Profile" />
            {!isVisibleEditForm
                ?   <div>
                        <h2>{user.firstname} {user.lastname}</h2>
                        <p>{user.nickname}</p>
                        <button onClick={() => { setIsVisibleEditForm(true) }}>
                            <span className="text_regular">Edit Profile</span>
                        </button>
                    </div>
                :   <div>
                        <div>
                            <label htmlFor="firstname">Firstname: </label>
                            <input
                                type="text"
                                id="firstname"
                                value={firstname}
                                onChange={event => { setFirstname(event.target.value) }} />
                        </div>
                        <div>
                            <label htmlFor="lastname">Lastname: </label>
                            <input
                                type="text"
                                id="lastname"
                                value={lastname}
                                onChange={event => { setLastname(event.target.value) }} />
                        </div>
                        <div>
                            <label htmlFor="nickname">Nickname: </label>
                            <input
                                type="text"
                                id="nickname"
                                value={nickname}
                                onChange={event => { setNickname(event.target.value) }} />
                        </div>
                        <button onClick={updateUser}>
                            <span className="text_regular">Save Changes</span>
                        </button>
                    </div>
            }
        </div>
    )
}