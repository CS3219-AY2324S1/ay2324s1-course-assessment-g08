import styles from '../styles/components/Matching.module.css';
import { socket, connectMatchingSocket } from '../sockets/matchingServiceSocket';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { 
    secondsState, 
    timerRunningState, 
    matchFoundModalVisibleState,
    queueComplexityState,
    buttonsDisabledState
} from '../recoil/TimeManagerAtom';
import Button from '@mui/material/Button';

const maxQueueTime = 30;

const Matching = () => {
    const navigate = useNavigate();

    const [buttonsDisabled, setButtonsDisabled] = useRecoilState(buttonsDisabledState);
    const [queueComplexity, setQueueComplexity] = useRecoilState(queueComplexityState);
    const [seconds, setSeconds] = useRecoilState(secondsState);
    const [timerRunning, setTimerRunning] = useRecoilState(timerRunningState);
    const setMatchFoundModalVisible = useRecoilState(matchFoundModalVisibleState)[1];

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

    const clickHandler = queueComplexity => {
        if (buttonsDisabled) {
            return;
        }
        
        setTimerRunning(true);
        setQueueComplexity(queueComplexity);

        connectMatchingSocket(
            queueComplexity, 
            JSON.parse(localStorage.getItem('credentials')).sessionToken, 
            matchFoundHandler
        );
        setButtonsDisabled(true);
    };

    const cancelHandler = () => {
        socket.disconnect();
        setTimerRunning(false);
        setButtonsDisabled(false);
        setSeconds(maxQueueTime);
    }

    return (
        <div className={styles["container"]}>
            <h3 className={styles["header"]}>Match with another user</h3>
            <div className={styles["button-group"]}>
                <button className={styles["easy-btn"]} onClick={() => clickHandler("Easy")} disabled={buttonsDisabled}>
                    Queue Easy
                </button>
                <button className={styles["medium-btn"]} onClick={() => clickHandler("Medium")} disabled={buttonsDisabled}>
                    Queue Medium
                </button>
                <button className={styles["hard-btn"]} onClick={() => clickHandler("Hard")} disabled={buttonsDisabled}>
                    Queue Hard
                </button>
            </div>
            {
                timerRunning && (
                    <div className={styles["timer-container"]}>
                        <p>Finding {queueComplexity} match...</p>
                        <p className={styles["seconds"]}>{seconds} seconds remaining</p>
                        <Button variant="outlined" size="medium" onClick={cancelHandler}>
                            Cancel
                        </Button>
                    </div>
                )
            }
        </div>
    );
};

export default Matching;