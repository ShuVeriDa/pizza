import {AnyAction, configureStore, ThunkDispatch} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {filterReducer} from "./slices/filterSlice";
import {cartReducer} from "./slices/cartSlice";
import {pizzaReducer} from "./slices/pizzaSlice";


export const store = configureStore({
   reducer: {
      filter: filterReducer,
      cart: cartReducer,
      pizza: pizzaReducer,
   }
})

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

//types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatchType = ThunkDispatch<RootState, unknown, AnyAction>
// export type DispatchType = typeof store.dispatch
