import { useState } from "react";
import Link from "@mui/material/Link";
import styles from "../styles/components/Authentication.module.css";
import { loginUser } from "../api/users";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "../recoil/UserAtom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Wallpaper from "../assets/wallpaper.png";

const LogIn = () => {
    const setIsLoggedIn = useRecoilState(isLoggedInState)[1];

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const logInButtonHandler = async (e) => {
        e.preventDefault();

        const res = await loginUser(username, password);
        if (res.status !== 200) {
            setErrorMessage(res.message);
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{
                                bgcolor: "#FFFFFF",
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                bgcolor: "#FFFFFF",
                            }}
                        />
                        {errorMessage && (
                            <p className={styles["error-msg"]}>
                                {errorMessage}
                            </p>
                        )}
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
                                <Link
                                    href="/signup"
                                    underline="hover"
                                    color="inherit"
                                >
                                    {"Don't have an account? Sign Up"}
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
