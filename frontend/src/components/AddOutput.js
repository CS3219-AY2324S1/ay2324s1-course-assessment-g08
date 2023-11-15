import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const AddOutput = ({ outputType, setOutputType }) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="output-type-label">
                Output Type
            </InputLabel>
            <Select
                labelId="output-type-label"
                id="output-type-label"
                value={outputType}
                label="Output Type"
                onChange={e => setOutputType(e.target.value)}
            >
                <MenuItem value={'Integer'}>Integer</MenuItem>
                <MenuItem value={'Float'}>Float</MenuItem>
                <MenuItem value={'String'}>String</MenuItem>
                <MenuItem value={'Array'}>Array</MenuItem>
            </Select>
        </FormControl>
    );
};

export default AddOutput;