import {v4} from "uuid";

export const UserType = {
    'admin': 1,
    'anchor': 2,
    'client': 3,
}

export const userTypeUtil = {
    is_admin(userType) {
        return userType === UserType.admin
    },
    is_anchor(userType) {
        return userType === UserType.anchor
    },
    is_client(userType) {
        return userType === UserType.client
    }
}

export const PageType = {
    'Home': 'home',
    'Room': 'room',
}

export const MessageUtil = {
    systemMessage: 1,
    giftMessage: 2,
    chatMessage: 3,
    roomMessage: 4,
    pageMessage: 5,
    currDate() {
        return new Date().getTime()
    },
    createMessage(type, data) {
        return {
            id: v4(),
            type: type,
            data: data,
            time: this.currDate()
        }
    },
    createChatMessage(data) {
        return this.createMessage(this.chatMessage, data);
    },
    createGiftMessage(data) {
        return this.createMessage(this.giftMessage, data);
    },
    createSystemMessage(data) {
        return this.createMessage(this.systemMessage, data);
    },
    createRoomMessage(data) {
        return this.createMessage(this.roomMessage, data);
    },
    createPageMessage(data) {
        return this.createMessage(this.pageMessage, data);
    }
}