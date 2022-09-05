import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";

import { signIn } from "./usersSlice";

import "./RegisterPage.css";

interface RegisterPageProps {
    isSignUp: boolean
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ isSignUp }) => {    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const dispatch = useAppDispatch();

    const onEmailChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    };
    const onPasswordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    };

    const onClickBtn = () => {
        if (!!isSignUp) {
            console.log("SignUp?! Maybe next time :)");
        }
        if (!isSignUp) {
            dispatch(signIn({ email, password }));
        }
    };

    const onEnterPressed = (event: React.KeyboardEvent) => {
        if (event.key !== "Enter") {
            return;
        }
        onClickBtn();
    };

    return (
        <div className="registerPage__container">
            <input
                type="email"
                value={email}
                placeholder="email"
                onChange={onEmailChanged}
                onKeyUp={onEnterPressed} />
            <input
                type="password"
                value={password} 
                placeholder="password"
                onChange={onPasswordChanged}
                onKeyUp={onEnterPressed} />
            <input
                type="button"
                value={isSignUp ? "Sign Up" : "Sign In"}
                onClick={onClickBtn} />
        </div>
    )
};