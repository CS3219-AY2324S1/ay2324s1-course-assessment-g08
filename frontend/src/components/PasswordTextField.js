import { TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";

const PasswordTextField = ({ label, name, error, setPassword, showPassword, setShowPassword }) => {
    return (
        <TextField
            error={error && error.length ? true : false}
            helperText={error}
            margin="normal"
            fullWidth
            label={label}
            name={name}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
            sx={{
                '& .MuiInputBase-root': {
                    bgcolor: "#FFFFFF"
                },
                '& .MuiFormHelperText-contained': {
                    bgcolor: "transparent",
                }
            }}
            InputProps={{
                endAdornment: 
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => setShowPassword(show => !show)}
                            onMouseDown={e => e.preventDefault()}
                            onMouseUp={e => e.preventDefault()}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
            }}
        />
    )
}

export default PasswordTextField ;