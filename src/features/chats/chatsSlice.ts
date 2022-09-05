import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

import {
    getAllChatsFb,
    setChatFb,
    deleteChatFb
} from "../../api/database";

export const getAllChats = createAsyncThunk(
    "chats/getAllChats",
    async () => {
        const chats = await getAllChatsFb();
        return chats;
    }
);
export const addChat = createAsyncThunk(
    "chats/addChat",
    async (chatTitle: string) => {
        const newChat: IChat = {
            id: nanoid(),
            title: chatTitle
        }
        await setChatFb(newChat);
        return newChat;
    }
);
export const updateChat = createAsyncThunk(
    "chats/updateChat",
    async (chat: IChat) => {
        await setChatFb(chat);
        return chat;
    }
);
export const deleteChat = createAsyncThunk(
    "chats/deleteChat",
    async (chatId: string) => {
        await deleteChatFb(chatId);
        return chatId;
    }
);

export interface IChat {
    id: string,
    title: string
}
interface IChatsState {
    status: "idle" | "loading" | "succeeded" | "failed",
    error: string
}

const chatsAdapter = createEntityAdapter<IChat>({
    sortComparer: (a, b) => a.title.localeCompare(b.title)
});

const initialState = chatsAdapter.getInitialState<IChatsState>({
    status: "idle",
    error: ""
});

const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // getAllChats
            .addCase(getAllChats.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(getAllChats.fulfilled, (state, action) => {
                state.status = "succeeded";
                chatsAdapter.setAll(state, action.payload)
            })
            .addCase(getAllChats.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })

            // addChat
            .addCase(addChat.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(addChat.fulfilled, (state, action) => {
                state.status = "succeeded";
                chatsAdapter.addOne(state, action.payload);
            })
            .addCase(addChat.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })

            // updateChat
            .addCase(updateChat.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(updateChat.fulfilled, (state, action) => {
                state.status = "succeeded";
                const { id, title } = action.payload;
                const existingChat = state.entities[id];
                if (existingChat) {
                    existingChat.title = title;
                }
            })
            .addCase(updateChat.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })

            // deleteChat
            .addCase(deleteChat.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(deleteChat.fulfilled, (state, action) => {
                state.status = "succeeded";
                chatsAdapter.removeOne(state, action.payload);
            })
            .addCase(deleteChat.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })
    }
});

export const {
    selectAll: selectChats,
    selectById: selectChatById,
    selectIds: selectChatIds
} = chatsAdapter.getSelectors((state: RootState) => state.chats);

export const selectChatsStatus = (state: RootState) => state.chats.status;

export default chatsSlice.reducer;