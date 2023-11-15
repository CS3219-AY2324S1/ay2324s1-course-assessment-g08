import { atom } from 'recoil';

export const secondsState = atom({
    key: 'seconds',
    default: 30
});

export const timerRunningState = atom({
    key: 'timerRunning',
    default: false
});

export const retryModalVisibleState = atom({
   key: 'retryModalVisible',
   default: false 
});

export const matchFoundModalVisibleState = atom({
    key: 'matchFoundModalVisible',
    default: false
});

export const queueComplexityState = atom({
    key: 'queueComplexity',
    default: ""
});

export const buttonsDisabledState = atom({
    key: 'buttonsDisabled',
    default: false
});