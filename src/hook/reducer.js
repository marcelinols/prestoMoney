const initialState = {
    users: [],
    inversiones: [],
    prestamos: [],
    admin: 0,
    uid: "",
    id_user: "",
}

const reducers = (state = initialState, action) => {
    switch (action.type) {
        case 'all_users':
            return { ...state, users: action.payload }
        case 'add_user':
            return { ...state, users: [...state.users, action.payload] }
        case 'add_investment':
            return { ...state, inversiones: [...state.inversiones, action.payload] }
        case 'all_investment':
            return { ...state, inversiones: action.payload }
        case 'add_loan':
            return { ...state, prestamos: [...state.prestamos, action.payload] }
        case 'all_loans':
            return { ...state, prestamos: action.payload }
        case 'admin':
            return { ...state, admin: action.payload }
        case 'uid':
            return { ...state, uid: action.payload }
        case 'id_user':
            return { ...state, id_user: action.payload }

        default:
            return state;
    }
}

export default reducers;