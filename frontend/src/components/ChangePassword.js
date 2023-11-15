import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import { useState } from "react";
import PasswordTextField from "./PasswordTextField";
import { changePassword } from "../api/users";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 550,
    bgcolor: '#ebd5d5',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    color: 'black',
    textAlign: 'center'
  };

const ChangePassword = ({isChangeVisible, setIsChangeVisible, setIsChangeSuccess }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const validateForm = () => {
        if (!currentPassword) {
            setCurrentPasswordError("Enter your current password");
            return false;
        } else {
            setCurrentPasswordError("");
        }

        if (!newPassword) {
            setNewPasswordError("Enter a new password");
            return false;
        } else {
            setNewPasswordError("")
        }

        if (!confirmNewPassword) {
            setConfirmNewPasswordError("Enter the same new password");
            return false;
        } else {
            setConfirmNewPasswordError("");
        }

        return true;
    }

    const closeButtonHandler = () => {
        setIsChangeVisible(false);
    }

    const changeButtonHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (newPassword === currentPassword) {
            setCurrentPasswordError("Your new password cannot be the same as your current password!");
            setNewPasswordError("Your new password cannot be the same as your current password!");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setNewPasswordError("Your new passwords do not match!");
            setConfirmNewPasswordError("Your new passwords do not match!");
            return;
        }

        const response = await changePassword(currentPassword, newPassword);
        if (response.status !== 200) {
            console.log(response);
            const errorLoc = response.errorLoc;
            if (errorLoc === "currentPassword") {
                setCurrentPasswordError(response.message);
            } else if (errorLoc === "newPassword") {
                setNewPasswordError(response.message);
            }
        } else {
            setIsChangeSuccess(true);
        }
    }

    return (
        <div>
            <Modal
                open={isChangeVisible}
                onClose={() => setIsChangeVisible(false)}
            >
                <Box sx={style}>
                <Typography sx={{ fontWeight: 'bold', fontSize: 32}}>Change Password</Typography>
                <Divider sx={{ bgcolor: '#000000', borderBottomWidth: 3 }}/>
                <Typography sx={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left', mt: 2, mb: -2 }} >Current Password</Typography>
                <PasswordTextField
                    label=""
                    name="password"
                    error={currentPasswordError}
                    setPassword={setCurrentPassword}
                    showPassword={showCurrentPassword}
                    setShowPassword={setShowCurrentPassword}
                />
                <Typography sx={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left', mt: 3, mb: -2 }} >New Password</Typography>
                <PasswordTextField
                    label=""
                    name="password"
                    error={newPasswordError}
                    setPassword={setNewPassword}
                    showPassword={showNewPassword}
                    setShowPassword={setShowNewPassword}
                />
                <Typography sx={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left', mt: 3, mb: -2 }} >Confirm New Password</Typography>
                <PasswordTextField
                    label=""
                    name="password"
                    error={confirmNewPasswordError}
                    setPassword={setConfirmNewPassword}
                    showPassword={showConfirmNewPassword}
                    setShowPassword={setShowConfirmNewPassword}
                />
                <Box display='flex' justifyContent='space-between' mt={4}>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 2,
                            bgcolor: '#FF0000',
                            fontSize: 18,
                            '&:hover': {
                                bgcolor: '#fc3232'
                            }
                        }}
                        onClick={closeButtonHandler}
                    >
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                        mt: 2,
                        bgcolor: '#6569fb',
                        fontSize: 18,
                        width: 150,
                        '&:hover': {
                            bgcolor: '#7e82fc'
                        }}}
                        onClick={changeButtonHandler}
                    >
                        Change
                    </Button>
                </Box>
                </Box>
            </Modal>
            <Button variant="contained"
                sx={{
                width: 'auto',
                mx: 'auto',
                mt: 4,
                bgcolor: '#6569fb',
                '&:hover': {
                    bgcolor: '#7e82fc'
                }
                }}
                onClick={() => setIsChangeVisible(true)}
            >
                Change Password
            </Button>
        </div>
    )
}

export default ChangePassword;