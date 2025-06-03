import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { PresentationData, PresentationDialog } from '../../types'

export interface PresentationState {
    presentationDialog: PresentationDialog,
    presentationData: PresentationData
}

const initialState: PresentationState = {
    presentationDialog: JSON.parse(localStorage.getItem("presentations") || "[]"),
    presentationData: JSON.parse(localStorage.getItem("presentationData") || "{}")
}

export const PresentationState = createSlice({
    name: 'presentations',
    initialState,
    reducers: {
        setPresentationDialog(state, action: PayloadAction<PresentationDialog>) {
            state.presentationDialog = action.payload
            localStorage.setItem("presentations", JSON.stringify(state.presentationDialog))
        },
        setPresentationData(state, action: PayloadAction<PresentationData>) {
            state.presentationData = action.payload
            localStorage.setItem("presentationData", JSON.stringify(state.presentationData))
        }
    },
})

export const { setPresentationDialog, setPresentationData } = PresentationState.actions
export default PresentationState.reducer
