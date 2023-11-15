import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import styles from '../styles/components/AddQuestionForm.module.css';
import AddIcon from '@mui/icons-material/Add';

const AddTestCase = ({ 
    expectedOutputs, 
    setExpectedOutputs,
    testCases,
    setTestCases,
    argumentNames
}) => {
    const expectedOutputChangeHandler = (e, index) => {
        const updatedExpectedOutputs = [...expectedOutputs];
        updatedExpectedOutputs[index] = e.target.value;
        setExpectedOutputs(updatedExpectedOutputs);
    }

    const updateTestCase = (index, field, e) => {
        const values = [...testCases];
        values[index][field] = e.target.value;
        setTestCases(values);
    }

    const addTestCase = () => {
        setTestCases([...testCases, {}]);
    };

    const removeTestCase = index => {
        let data = [...testCases];
        data.splice(index, 1);
        setTestCases(data);

        let outputs = [...expectedOutputs];
        outputs.splice(index, 1);
        setExpectedOutputs(outputs);
    };

    return (
        <div>
            <div>
                {
                    testCases.map((_, index) => (
                        <div key={index} className={styles["test-case-container"]}>
                            <InputLabel>Test Case {index}</InputLabel>
                            {
                                argumentNames.map((name, k) => (
                                    <TextField
                                        key={k}
                                        required
                                        fullWidth
                                        label={name}
                                        value={testCases[index][name] ? testCases[index][name]: "" }
                                        onChange={e => updateTestCase(index, name, e)} 
                                    />
                                ))
                            }
                            <TextField
                                required
                                fullWidth
                                label={"Expected Output"}
                                value={expectedOutputs[index] ? expectedOutputs[index] : "" }
                                onChange={e => expectedOutputChangeHandler(e, index) } 
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => removeTestCase(index)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))
                }
            </div>
            <Button
                    variant="contained"
                    color="primary"
                    onClick={addTestCase}
                    startIcon={<AddIcon />}
                    fullWidth
                    sx = {{ marginTop: 1 }}
            >
                    Add a test case
            </Button>
        </div>
    );
};

export default AddTestCase;