import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ACTIONS from "../api/actions";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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

const ChangeQuestionModal = ({ socketRef, isVisible, closeHandler, roomId, currentQuestionId }) => {
    const [newQuestionComplexity, setNewQuestionComplexity] = useState('Easy');
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CHANGE_QUESTION, async ({ complexity }) => {
                closeHandler();
                setRequestSent(false);
                
                let randomQuestion = await getRandomQuestion(complexity);

                while (randomQuestion._id === currentQuestionId) {
                    randomQuestion = await getRandomQuestion(complexity);
                }
        
                const isSuccessful = await updateRoomQuestion(roomId, randomQuestion._id);
                if (!isSuccessful) {
                    return;
                }
            
                socketRef.current.emit(ACTIONS.SYNC_QUESTION, {
                    roomId,
                    newQuestionId: randomQuestion._id
                });
            });
        }
    }, [socketRef.current]);

    const requestChangeHandler = () => {
        socketRef.current.emit(ACTIONS.REQUEST_QUESTION_CHANGE, {
            roomId,
            complexity: newQuestionComplexity
        });

        setRequestSent(true);

        setTimeout(() => {
            closeHandler();
            setRequestSent(false);
        }, 2000);
    };

    const handleComplexityChange = e => {
        setNewQuestionComplexity(e.target.value);
    };

    return (
      <div>
        <Modal
          open={isVisible}
          onClose={closeHandler}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            {
                !requestSent ? (
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
                        Request Question Change
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">New Question Difficulty</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={newQuestionComplexity}
                                label="New Question Difficulty"
                                onChange={handleComplexityChange}
                            >
                                <MenuItem selected value="Easy">Easy</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Hard">Hard</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography id="modal-modal-description" sx={{ mt: 2, color: 'red', marginBottom: 1 }}>
                            Changing question will delete the code you have written!
                        </Typography>
                        <Button variant="contained" color="secondary" onClick={requestChangeHandler}>
                            Request Change
                        </Button>
                    </Box>
                ) : (
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: 2, color: 'green' }}>
                            Request Sent!
                        </Typography>
                        <Typography id="modal-modal-description" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
                            You need your partner to accept the request
                        </Typography>
                    </Box>
                )
            }
        </Modal>
      </div>
    ); 
};

export default ChangeQuestionModal;