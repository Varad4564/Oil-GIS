import { configureStore } from '@reduxjs/toolkit';
import CurrentLatLngReducer from '../Slices/CurrentLatLngSlice'
import ReactangleArrayReducer from '../Slices/ReactangleArraySlice';
import PolygonArrayReducer from '../Slices/PolygonArraySlice'
import FullScreenReducer from '../Slices/FullScreenSlice'; 
import DrawGeometryModeReducer from '../Slices/DrawGeometryModeSlice';
import PolyLineArrayReducer from '../Slices/PolyLineArraySlice';
import RectangleCoordinatesReducer from '../Slices/RectangleCoordinatesSlice';
import CircleArrayReducer from '../Slices/CircleArraySlice';
import SelectedFilelayerArrayReducer from '../Slices/SelectedFilelayerArraySlice';

export const ToolKitStore =  configureStore({
    reducer:{
        CurrentLatLngState: CurrentLatLngReducer,
        ReactangleArrayState: ReactangleArrayReducer,
        RectangleCoordinatesState: RectangleCoordinatesReducer,
        PolygonArrayState: PolygonArrayReducer,
        PolyLineArrayState: PolyLineArrayReducer,
        FullScreenState: FullScreenReducer,
        DrawGeometryModeState: DrawGeometryModeReducer,
        CircleArrayState: CircleArrayReducer,
        SelectedFilelayerArrayState: SelectedFilelayerArrayReducer,
    }
})