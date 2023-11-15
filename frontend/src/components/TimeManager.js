import { useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { 
    secondsState, 
    timerRunningState, 
    queueComplexityState, 
    buttonsDisabledState, 
    matchFoundModalVisibleState 
} from '../recoil/TimeManagerAtom';
import { connectMatchingSocket, socket } from '../sockets/matchingServiceSocket';
import RetryModal from '../components/RetryModal';
import MatchFoundModal from '../components/MatchFoundModal';

const maxQueueTime = 30;

const TimerManager = () => {
    const navigate = useNavigate();

    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    const setSeconds = useRecoilState(secondsState)[1];
    const [timerRunning, setTimerRunning] = useRecoilState(timerRunningState);
    const [matchFoundModalVisible, setMatchFoundModalVisible] = useRecoilState(matchFoundModalVisibleState);
    const [queueComplexity, setQueueComplexity] = useRecoilState(queueComplexityState);
    const [buttonsDisabled, setButtonsDisabled] = useRecoilState(buttonsDisabledState);
    const [retryModalVisible, setRetryModalVisible] = useState(false);

    const matchFoundHandler = (roomId) => {
        setButtonsDisabled(false);
        setTimerRunning(false);
        setSeconds(maxQueueTime);

        setMatchFoundModalVisible(true);

        setTimeout(() => {
            setMatchFoundModalVisible(false);
            navigate(`/editor/${roomId}`);
        }, 3000);

        console.log("matched, joining room: ", roomId);
    }

    const noMatchFoundHandler = () => {
        setTimerRunning(false);
        setSeconds(maxQueueTime);
        setButtonsDisabled(false);
        
        setRetryModalVisible(true);
        socket.disconnect();
    }

    const retryButtonHandler = () => {        
        if (buttonsDisabled) {
            return;
        }
        
        setTimerRunning(true);
        setQueueComplexity(queueComplexity);

        connectMatchingSocket(
            queueComplexity, 
            JSON.parse(localStorage.getItem('credentials')).sessionToken, 
            matchFoundHandler,
        );
        setButtonsDisabled(true);
    };

    useEffect(() => {
        if (timerRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);
            
            timeoutRef.current = setTimeout(() => noMatchFoundHandler(), maxQueueTime * 1000);
        } else {
            clearTimeout(timeoutRef.current);
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [timerRunning])

  return (
    <div>
        <RetryModal 
            isVisible={retryModalVisible} 
            setIsVisible={setRetryModalVisible}
            queueComplexity={queueComplexity}
            retryButtonHandler={retryButtonHandler}
        />
        <MatchFoundModal
            isVisible={matchFoundModalVisible}
        />
    </div>
  );
};

export default TimerManager;
