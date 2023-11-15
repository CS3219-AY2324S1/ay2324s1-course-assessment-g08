import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const AddComplexity = ({ complexity, setComplexity }) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="complexity-label">
                Complexity
            </InputLabel>
            <Select
                labelId="complexity-label"
                id="complexity"
                value={complexity}
                label="Complexity"
                onChange={e => setComplexity(e.target.value)}
            >
                <MenuItem value={'Easy'}>Easy</MenuItem>
                <MenuItem value={'Medium'}>Medium</MenuItem>
                <MenuItem value={'Hard'}>Hard</MenuItem>
            </Select>
        </FormControl>
    );
};

export default AddComplexity;