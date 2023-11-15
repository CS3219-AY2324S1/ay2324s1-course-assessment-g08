import React, { useState, useEffect } from "react";
import styles from "../styles/pages/Room.module.css";
import ACTIONS from "../api/actions";
import { fetchQuestionById } from "../api/questions";
import ChangeQuestionModal from "./ChangeQuestionModal";
import RequestQuestionModal from "./RequestQuestionModal";
import DeclineQuestionChangeModal from "./DeclineQuestionChangeModal";

const ChangeQuestionButton = ({
    socketRef,
    setQuestion,
    roomId,
    currentQuestionId,
    setQuestionChanged
}) => {
    const [changeModalVisible, setChangeModalVisible] = useState(false);
    const [requestModalVisible, setRequestModalVisible] = useState(false);
    const [requestComplexity, setRequestComplexity] = useState("Easy");
    const [declineChangeModalVisible, setDeclineChangeModalVisible] = useState(false);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(
                ACTIONS.SYNC_QUESTION,
                async ({ newQuestionId }) => {
                    const newQuestion = await fetchQuestionById(newQuestionId);
                    setQuestion(newQuestion);
                    setQuestionChanged(true);
                }
            );
    
            socketRef.current.on(
                ACTIONS.REQUEST_QUESTION_CHANGE,
                ({ complexity }) => {
                    setRequestModalVisible(true);
                    setRequestComplexity(complexity);
                }
            );
    
            socketRef.current.on(
                ACTIONS.DECLINE_QUESTION_CHANGE,
                () => {
                    setDeclineChangeModalVisible(true);
                }
            );
        }
    }, [socketRef.current]);

    return (
        <div>
            <button
                className={`${styles["btn"]} ${styles["copy-btn"]}`}
                onClick={() => setChangeModalVisible(true)}
            >
                Change Question
            </button>
            <ChangeQuestionModal
                socketRef={socketRef}
                isVisible={changeModalVisible}
                roomId={roomId}
                closeHandler={() => setChangeModalVisible(false)}
                currentQuestionId={currentQuestionId}
            />
            <RequestQuestionModal
                socketRef={socketRef}
                roomId={roomId}
                currentQuestionId={currentQuestionId}
                newComplexity={requestComplexity}
                isVisible={requestModalVisible}
                closeHandler={() => setRequestModalVisible(false)}
                setQuestionChanged={setQuestionChanged}
            />
            <DeclineQuestionChangeModal
                isVisible={declineChangeModalVisible}
                closeHandler={() => setDeclineChangeModalVisible(false)}
            />
        </div>
    );
};

export default ChangeQuestionButton;