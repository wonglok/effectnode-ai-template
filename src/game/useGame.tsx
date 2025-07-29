import { create } from 'zustand'

export const useGame = create<any>((set, get) => {
    return {
        keyboard: false,
        game: false,
    }
})
