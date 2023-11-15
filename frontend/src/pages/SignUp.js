import { useState } from "react";
import { registerUser } from "../api/users";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import UsernameTextField from "../components/UsernameTextField";
import PasswordTextField from "../components/PasswordTextField";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const validateForm = () => {
        if (!username) {
            setUsernameError("Enter a username");
            return false;
        } else {
            setUsernameError("");
        }

        if (!password) {
            setPasswordError("Enter a password");
            return false;
        } else {
            setPasswordError("");
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Enter the same password");
            return false;
        } else {
            setConfirmPasswordError("");
        }

        return true;
    }

    const registerBtnHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match!");
            setConfirmPasswordError("Passwords do not match!");
            return;
        }

        const res = await registerUser(username, password);
        if (res.status !== 201) {
            setUsernameError(res.message[0]);
            setPasswordError(res.message[1]);
            return;
        }

        navigate("/");
    };

    return (
        <Grid
            container
            component="main"
            sx={{ height: "100vh", bgcolor: "#F9F1E3" }}
        >
            <CssBaseline />
            <Container component="main">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "#1976d2" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <UsernameTextField 
                                    error={usernameError} 
                                    setUsername={setUsername} 
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordTextField
                                    label="Password"
                                    name="password"
                                    error={passwordError}
                                    setPassword={setPassword}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordTextField
                                    label="Confirm Password"
                                    name="confirm-password"
                                    error={confirmPasswordError}
                                    setPassword={setConfirmPassword}
                                    showPassword={showConfirmPassword}
                                    setShowPassword={setShowConfirmPassword}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={registerBtnHandler}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                Already have an account? &nbsp;
                                <Link
                                    href="/"
                                    underline="hover"
                                    color="#0000EE"
                                >
                                    Log in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Grid>
    );
};

export default SignUp;
