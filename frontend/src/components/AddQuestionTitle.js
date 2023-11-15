import TextField from '@mui/material/TextField';

const AddQuestionTitle = ({ title, setTitle }) => {
    return (
        <TextField
            required
            fullWidth
            id="add-title"
            label="Question Title"
            name="title"
            autoComplete="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
    )
}

export default AddQuestionTitle;