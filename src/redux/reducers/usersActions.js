export const setCurrentUser = (currentUser) => {
    return dispatch=>{
        dispatch({
            type:"LOGIN_USER",
            payload:currentUser
        })
    }
}       // WILL NOT USE THIS ONE.