const ROLES = {
    ADMIN: "admin",
    CLIENT: "client",
    CASHIER: "cashier"
}

const PERMISSIONS = {
    // USERS PERMISSIONS
    CREATE_USERS: "create:users",
    UPDATE_USERS: "update:users",
    DEACTIVATE_USERS: "deactivate:users",
    VIEW_DASHBOARD: "view:dashboard",

    // LOANS PERMISSIONS
    CREATE_LOANS: "create:loans",
    UPDATE_LOANS: "update:loans",
    CANCEL_LOANS: "cancel:loans",

    // CARDS PERMISSIONS
    CREATE_CARD: "create:card",
    CANCEL_CARD: "cancel:card",
    UPDATE_CARD: "update:card",

    // SAVINGS ACCOUNT
    CREATE_SAVINGS_ACCOUNT: "create:saving_account",
    UPDATE_SAVINGS_ACCOUNT: "update:saving_account",
    CANCEL_SAVINGS_ACCOUNT: "cancel:saving_account"
}


const ROLE_PERMISSIONS = Object.freeze({
    [ROLES.ADMIN]: [
        PERMISSIONS.CREATE_USERS,
        PERMISSIONS.UPDATE_USERS,
        PERMISSIONS.DEACTIVATE_USERS,
        PERMISSIONS.CREATE_LOANS,
        PERMISSIONS.UPDATE_LOANS,
        PERMISSIONS.CANCEL_LOANS,
        PERMISSIONS.VIEW_DASHBOARD
    ],

    [ROLES.CLIENT]: [

    ]
})


module.exports = { ROLES, PERMISSIONS, ROLE_PERMISSIONS } 