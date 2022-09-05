import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    // createSelector
} from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

import {
    getAllMessagesFb,
    setMessageFb,
    deleteMessageFb
} from "../../api/database";

export const getAllMessages = createAsyncThunk(
    "messages/getAllMessages",
    async (chatId: string) => {
        const messages = await getAllMessagesFb(chatId);
        return messages;
    }
);
export const addMessage = createAsyncThunk<
    IMessage,
    {
        chatId: string,
        userId: string,
        text: string
    }
>(
    "messages/addMessage",
    async ({chatId, userId, text}) => {
        const message: IMessage = {
            id: nanoid(),
            date: (new Date()).toISOString(),
            text,
            chat: chatId,
            user: userId
        };
        await setMessageFb(message);
        return message;
    }
);
export const updateMessage = createAsyncThunk(
    "messages/updateMessage",
    async (message: IMessage) => {
        await setMessageFb(message);
        return message;
    }
);
export const deleteMessage = createAsyncThunk<
    string,
    { chatId: string, messageId: string }
>(
    "",
    async ({chatId, messageId}) => {
        await deleteMessageFb(chatId, messageId);
        return messageId;
    }
);

export interface IMessage {
    id: string,
    date: string,
    text: string,
    chat: string,
    user: string
}
interface IMessagesState {
    status: "idle" | "loading" | "succeeded" | "failed",
    error: string
}

const messagesAdapter = createEntityAdapter<IMessage>({
    sortComparer: (a, b) => a.date.localeCompare(b.date)
});

const initialState = messagesAdapter.getInitialState<IMessagesState>({
    status: "idle",
    error: ""
});

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // getAllMessages
            .addCase(getAllMessages.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(getAllMessages.fulfilled, (state, action) => {
                state.status = "succeeded";
                messagesAdapter.setAll(state, action.payload);
            })
            .addCase(getAllMessages.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })

            // addMessage
            .addCase(addMessage.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(addMessage.fulfilled, (state, action) => {
                state.status = "succeeded";
                messagesAdapter.addOne(state, action.payload);
            })
            .addCase(addMessage.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })

            // updateMessage
            .addCase(updateMessage.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(updateMessage.fulfilled, (state, action) => {
                state.status = "succeeded";
                const { id, text } = action.payload;
                const existingMessage = state.entities[id];
                if (existingMessage) {
                    existingMessage.text = text;
                }
            })
            .addCase(updateMessage.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })

            // deleteMessage
            .addCase(deleteMessage.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.status = "succeeded";
                messagesAdapter.removeOne(state, action.payload);
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "";
            })
    }
});

export const {
    selectAll: selectMessages,
    selectById: selectMessageById,
    selectIds: selectMessageIds
} = messagesAdapter.getSelectors((state: RootState) => state.messages);

export const selectMessagesStatus = (state: RootState) => state.messages.status;

// export const selectMessageIdsByChat = createSelector(
//     [selectMessages, (state, chatId) => chatId],
//     (messages, chatId) => messages.filter(message => message.chat === chatId)
//                                     .map(message => message.id)
// );

export default messagesSlice.reducer;