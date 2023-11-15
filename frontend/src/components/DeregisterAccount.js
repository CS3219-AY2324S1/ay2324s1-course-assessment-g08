import styles from '../styles/components/DeregisterAccount.module.css';
import { deregisterUser } from '../api/users';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isLoggedInState } from '../recoil/UserAtom';
import ConfirmDialog from './ConfirmDialog';
import { useState } from 'react';
import { Button } from '@mui/material';

const DeregisterAccount = () => {
    const navigate = useNavigate();
    const setIsLoggedIn = useRecoilState(isLoggedInState)[1];

    const [confirmOpen, setConfirmOpen] = useState(false);

    const deregisterBtnHandler = async () => {
        const res = await deregisterUser();
        
        if (res.status === 200) {
            setIsLoggedIn(false);
            navigate("/")
            localStorage.removeItem('credentials');
        }
    }

    return (
        <div>
            <Button variant="contained"
                sx={{
                    width: 'auto',
                    mx: 'auto',
                    my: 3,
                    bgcolor: '#FF0000',
                    '&:hover': {
                        bgcolor: '#fc3232'
                    }
                }}
                onClick={() => setConfirmOpen(true)}
            >
                DELETE ACCOUNT
            </Button>
            <ConfirmDialog
                title="Account cannot be recovered!"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={deregisterBtnHandler}
            >
                Are you sure you want to delete your account ?
            </ConfirmDialog>
        </div>
    );
};

export default DeregisterAccount;