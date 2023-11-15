import { TextField } from "@mui/material";

const UsernameTextField = ({ error, setUsername }) => {
    return (
        <TextField
            error={error && error.length ? true : false}
            helperText={error}
            label="Username"
            margin="normal"
            name="username"
            fullWidth
            autoComplete="username"
            autoFocus
            onChange={e => setUsername(e.target.value)}
            sx={{
                '& .MuiInputBase-root': {
                    bgcolor: "#FFFFFF"
                },
                '& .MuiFormHelperText-contained': {
                    bgcolor: "transparent",
                }
            }}
        />
    )
}

export default UsernameTextField;