const initialState = {
    users: [],
    inversiones: [],
    prestamos: [],
    admin: 0,
}

const reducers = (state = initialState, action) => {
    switch (action.type) {
        case 'add_users':
            return { ...state, users: action.payload }
        case 'add_inversiones':
            return { ...state, inversiones: action.payload }
        case 'add_prestamos':
            return { ...state, prestamos: action.payload }
        case 'admin':
            return { ...state, admin: 1 }
        default:
            return state;
    }

}

export default reducers;