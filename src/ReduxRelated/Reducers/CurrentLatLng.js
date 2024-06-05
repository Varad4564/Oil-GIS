const initailState = null;

export const CurrentLatLng = (state=initailState,action) => {
    switch (action.type) {
        case "SetCurrentLatLng":
            return action.data;
            break;
        default:
            return state;
            break;
    }
}