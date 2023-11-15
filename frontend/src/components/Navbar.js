import styles from "../styles/components/Navbar.module.css";
import Logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "../recoil/UserAtom";
import { getUsername } from "../api/users";
import { useState, useEffect } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

const settings = ["Profile", "Logout"];

const Navbar = () => {
    const navigate = useNavigate();
    const setIsLoggedIn = useRecoilState(isLoggedInState)[1];
    const [username, setUsername] = useState("");
    const [anchorElUser, setAnchorElUser] = useState(null);

    useEffect(() => {
        getUsername().then((res) => setUsername(res));
    }, []);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const editProfileHandler = () => {
        setAnchorElUser(null);
        navigate("/profile");
    };

    const signOutHandler = () => {
        setAnchorElUser(null);
        setIsLoggedIn(false);
        navigate("/");
        localStorage.removeItem("credentials");
    };

    return (
        <AppBar position="static" sx={{bgcolor: '#1c1a1a'}}>
            <Container maxWidth="auto">
                <Toolbar disableGutters>
                    <Link to="/" className={styles["logo-container"]}>
                        <img className={styles["logo"]} src={Logo} alt="Logo" />
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                fontWeight: "bold",
                                fontSize: '1.5rem',
                                color: "inherit",
                                padding: '20px 0'
                            }}
                        >
                            PeerPrep
                        </Typography>
                    </Link>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    ></Box>
                    <Button
                        key="Create Room"
                        sx={{
                            my: 2,
                            color: "white",
                            display: "block",
                            marginRight: "2rem",
                        }}
                        onClick={() => navigate("/createRoom")}
                    >
                        Custom Room
                    </Button>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="User options">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    alt={username}
                                    src="/static/images/avatar/2.jpg"
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem
                                key={settings[0]}
                                onClick={editProfileHandler}
                            >
                                <Typography textAlign="center">
                                    {settings[0]}
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                key={settings[1]}
                                onClick={signOutHandler}
                            >
                                <Typography textAlign="center">
                                    {settings[1]}
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
