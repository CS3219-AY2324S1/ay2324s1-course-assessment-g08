import styles from '../styles/components/RetryModal.module.css';

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

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

const RetryModal = ({
    isVisible, 
    setIsVisible,
    queueComplexity,
    retryButtonHandler
}) =>  {
    const clickHandler = () => {
        retryButtonHandler(queueComplexity);
        setIsVisible(false);
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={isVisible}
                onClose={() => setIsVisible(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isVisible}>
                    <Box sx={style} className={styles["box"]}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                        Matching Failed
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                        There were too less people in the {queueComplexity} queue
                        </Typography>
                        <div className={styles["button-group"]}>
                            <button className={styles["retry-btn"]} onClick={clickHandler}>
                                Retry
                            </button>
                            <button className={styles["cancel-btn"]} onClick={() => setIsVisible(false)}>
                                Cancel
                            </button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
};

export default RetryModal;