import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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

const DeclineQuestionChangeModal = ({ isVisible, closeHandler }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            closeHandler();   
        }, 2000);

        return () => {
            clearTimeout(timeout);
        };
    }, [isVisible]);
    
    return (
        <div>
            <Modal
                open={isVisible}
                onClose={closeHandler}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
                        Your room mate has declined your change question request
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
};

export default DeclineQuestionChangeModal;