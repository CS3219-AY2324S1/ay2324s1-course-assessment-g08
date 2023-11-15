import { useState } from "react";
import Link from "@mui/material/Link";
import { loginUser } from "../api/users";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "../recoil/UserAtom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Wallpaper from "../assets/wallpaper.png";
import UsernameTextField from "../components/UsernameTextField";
import PasswordTextField from "../components/PasswordTextField";

const LogIn = () => {
    const setIsLoggedIn = useRecoilState(isLoggedInState)[1];

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const validateForm = () => {
        if (!username) {
            setUsernameError("Enter a username")
            return false
        } else {
            setUsernameError("")
        }

        if (!password) {
            setPasswordError("Enter a password")
            return false
        } else {
            setPasswordError("")
        }

        return true
    }

    const logInButtonHandler = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const res = await loginUser(username, password);
            if (res.status !== 200) {
                if (res.errorType === "invalid-username") {
                    setUsernameError(res.message)
                } else if (res.errorType === "invalid-password") {
                    setPasswordError(res.message)
                }
                return;
            }

            localStorage.setItem(
                "credentials",
                JSON.stringify({
                    sessionToken: res.token,
                    username: res.username,
                    isManager: res.isManager,
                })
            );

            setIsLoggedIn(true);
        }
    };

    return (
        <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: `url(${Wallpaper})`,
                    backgroundRepeat: "no-repeat",
                    backgroundColor: (t) =>
                        t.palette.mode === "dark"
                            ? t.palette.grey[50]
                            : t.palette.grey[900],
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
                sx={{
                    bgcolor: "#F9F1E3",
                }}
            >
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "#1976d2" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <UsernameTextField 
                            error={usernameError} 
                            setUsername={setUsername} 
                        />
                        <PasswordTextField 
                            label="Password"
                            name="password"
                            error={passwordError}
                            setPassword={setPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            onClick={logInButtonHandler}
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                Don't have an account? &nbsp;
                                <Link
                                    href="/signup"
                                    underline="hover"
                                    color="#0000EE"
                                >
                                    Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default LogIn;
