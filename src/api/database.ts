import { firebase } from "./firebase";
import { getDatabase, ref, child, get, set, remove } from "firebase/database";

import { IChat } from "../features/chats";
import { IMessage } from "../features/messages";
import { IProfile } from "../features/users";

const db = getDatabase(firebase);

export const getAllChatsFb = async () => {
    return new Promise<IChat[]>((resolve, rejected) => {
        get(child(ref(db), "chats"))
            .then((snapshots) => {
                const chats:IChat[] = [];
                snapshots.forEach(snapshot => {
                    chats.push(snapshot.val());
                });
                
                resolve(chats);
            })
            .catch((error) => { rejected(error) })
    })
};

export const setChatFb = async (chat: IChat) => {
    return new Promise<void>((resolve, rejected) => {
        set(ref(db, 'chats/' + chat.id), { ...chat })
            .then(() => { resolve() })
            .catch((error) => { rejected(error) })
    })
};

export const deleteChatFb = async (chatId: string) => {
    return new Promise<void>((resolve, rejected) => {
        remove(ref(db, 'chats/' + chatId))
            .then(() => { resolve() })
            .catch((error) => { rejected(error) })
    })
};

export const getAllMessagesFb = async (chatId: string) => {
    return new Promise<IMessage[]>((resolve, rejected) => {
        get(child(ref(db), "messages/" + chatId))
            .then((snapshots) => {
                const messages: IMessage[] = [];
                snapshots.forEach(snapshot => {
                    messages.push(snapshot.val());
                });
                
                resolve(messages);
            })
            .catch((error) => { rejected(error) })
    })
};

export const setMessageFb = async (message: IMessage) => {
    return new Promise<void>((resolve, rejected) => {
        set(ref(db, `messages/${message.chat}/${message.id}`), { ...message })
            .then(() => { resolve() })
            .catch((error) => { rejected(error) })
    })
}

export const deleteMessageFb = async (chatId: string, messageId: string) => {
    return new Promise<void>((resolve, rejected) => {
        remove(ref(db, `messages/${chatId}/${messageId}`))
            .then(() => { resolve() })    
            .catch((error) => { rejected(error) })
    })
};

export const getAllProfilesFb = async () => {
    return new Promise<Record<string, IProfile>>((resolve, rejected) => {
        get(child(ref(db), "profiles"))
            .then((snapshots) => {
                const profiles: Record<string, IProfile> = {};
                snapshots.forEach(snapshot => {
                    const profile = snapshot.val();
                    if (profile) { profiles[profile.id] = profile };
                });
                
                resolve(profiles);
            })
            .catch((error) => { rejected(error) })
    })
};

export const setProfileFb = async (profile: IProfile) => {
    return new Promise<void>((resolve, rejected) => {
        set(ref(db, 'profiles/' + profile.id), { ...profile })
            .then(() => { resolve() })
            .catch((error) => { rejected(error) })
    })
};