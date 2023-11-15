import { selector } from 'recoil';
import { isLoggedInState } from './UserAtom';

export const isLoggedInSelector = selector({
    key: 'isLoggedInSelector',
    get: ({ get }) => get(isLoggedInState)
});