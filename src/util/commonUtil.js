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