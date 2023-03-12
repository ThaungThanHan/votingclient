const initialState = {
    currentUser:{}
}

function UsersReducers(state=initialState,action){
    switch(action.type){
        case "LOG_IN":
            return{...state,currentUser:action.payload}
    }
    return state;
}

export default UsersReducers;