import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { RootState, AppDispatch } from "../../app/store";

import {
    signInFb,
    signOutFb,
    signUpFb
} from "../../api/auth";
import {
    getAllProfilesFb,
    setProfileFb
} from "../../api/database";

export const signIn = createAsyncThunk<
    // Return type of the payload creator
    string,
    // First argument to the payload creator
    { email: string, password: string },
    {
        // Optional fields for defining thunkApi field types
        dispatch: AppDispatch
    }
>("users/signIn", async (user, { dispatch }) => {
        const userId = await signInFb(user.email, user.password);
        dispatch(getAllProfiles());
        return userId;
    }
);
export const signOut = createAsyncThunk(
    "users/signOut",
    async () => { await signOutFb() }
);
export const signUp = createAsyncThunk<
    string,
    { email: string, password: string },
    { dispatch: AppDispatch }
>(
    "users/signUp",
    async (user, { dispatch }) => {
        const userId = await signUpFb(user.email, user.password);
        await setProfileFb({
            id: userId,
            email: user.email,
            firstname: "",
            lastname: "",
            nickname: user.email
        })
        dispatch(getAllProfiles());
        return userId;
    }
);

export const getAllProfiles = createAsyncThunk(
    "users/getAllProfiles",
    async () => {
        return await getAllProfilesFb()
    }
);
export const updateProfile = createAsyncThunk(
    "users/updateProfile",
    async (profile: IProfile) => {
        await setProfileFb(profile);
        return profile;
    }
);

export interface IProfile {
    id: string,
    firstname: string,
    lastname: string,
    nickname: string,
    email: string
};
interface IUsersState {
    isAuth: boolean,
    authUserId: string,
    status: "idle" | "loading" | "succeeded" | "failed",
    error: string
}

const usersAdapter = createEntityAdapter<IProfile>();

const initialState = usersAdapter.getInitialState<IUsersState>({
    isAuth: false,
    authUserId: "",
    status: "idle",
    error: ""
});

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // signIn
            .addCase(signIn.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
                state.isAuth = false;
                state.authUserId = "";
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.isAuth = true
                state.authUserId = action.payload;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })
            
            //signOut
            .addCase(signOut.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(signOut.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.isAuth = false;
                state.authUserId = "";
            })
            .addCase(signOut.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })

            // signUp
            .addCase(signUp.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
                state.isAuth = false;
                state.authUserId = "";
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.isAuth = true
                state.authUserId = action.payload;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })

            // getAllProfiles
            .addCase(getAllProfiles.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(getAllProfiles.fulfilled, (state, action) => {
                state.status = "succeeded";
                usersAdapter.setAll(state, action.payload);
            })
            .addCase(getAllProfiles.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })

            // updateProfile
            .addCase(updateProfile.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.status = "succeeded";
                // updateOne() update store
                // but useSelector on the UserPage won't be called to update profiles' data on the page
                // usersAdapter.updateOne(state, action.payload);
                const existingUser = state.entities[action.payload.id];
                if (existingUser) {
                    existingUser.lastname = action.payload.lastname;
                }
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })
    }
});

export const {
    selectAll: selectUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = usersAdapter.getSelectors((state: RootState) => state.users);

export const selectUsersStatus = (state: RootState) => 
    state.users.status;
export const selectUserNicknameById = (state: RootState, userId: string) => 
    state.users.entities[userId]?.nickname;
export const selectAuthUserId = (state: RootState) => 
    state.users.authUserId;
export const selectAuthStatus = (state: RootState) => 
    state.users.isAuth;

export default usersSlice.reducer;