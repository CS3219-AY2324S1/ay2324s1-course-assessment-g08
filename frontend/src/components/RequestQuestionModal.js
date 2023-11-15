import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ACTIONS from "../api/actions";
import { getRandomQuestion } from "../api/questions";
import { updateRoomQuestion } from "../api/collaboration";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    color: 'black'
};

const RequestQuestionModal = ({ 
    socketRef, 
    newComplexity,
    roomId,
    currentQuestionId, 
    isVisible, 
    closeHandler,
    setQuestionChanged
}) => {
    const onAccept = async () => {
        let randomQuestion = await getRandomQuestion(newComplexity);

        while (randomQuestion._id === currentQuestionId) {
            randomQuestion = await getRandomQuestion(newComplexity);
        }

        const isSuccessful = await updateRoomQuestion(roomId, randomQuestion._id);
        if (!isSuccessful) {
            return;
        }
    
        socketRef.current.emit(ACTIONS.SYNC_QUESTION, {
            roomId,
            newQuestionId: randomQuestion._id
        });

        setQuestionChanged(true);
        closeHandler();
    };

    const onDecline = () => {
        socketRef.current.emit(ACTIONS.DECLINE_QUESTION_CHANGE, {
            roomId
        });

        closeHandler();
    };

    return (
        <div>
            <Modal
                open={isVisible}
                onClose={onDecline}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
                        Your room mate requested to change to another {newComplexity} question
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, color: 'red', marginBottom: 1 }}>
                        Changing question will delete the code you have written!
                    </Typography>
                    <Button variant="contained" color="primary" onClick={onAccept} sx ={{ marginRight: 2 }}>
                        Accept
                    </Button>
                    <Button variant="contained" color="secondary" onClick={onDecline}>
                        Decline
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default RequestQuestionModal;