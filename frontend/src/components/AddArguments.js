import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styles from '../styles/components/AddQuestionForm.module.css';
import TextField from '@mui/material/TextField';

const AddArguments = ({ 
    inputCount, 
    setInputCount, 
    argumentNames, 
    setArgumentNames, 
    testCases, 
    setTestCases,
    types,
    setTypes
}) => {
    const argumentNameChangeHandler = (e, index) => {
        const oldName= argumentNames[index];

        const updatedArgumentNames = [...argumentNames];
        updatedArgumentNames[index] = e.target.value;
        setArgumentNames(updatedArgumentNames);

        const updatedTestCases = testCases.map(testCase => {
            const value = testCase[oldName];
            delete testCase[oldName];

            testCase[e.target.value] = value;

            return testCase;
        });

        setTestCases(updatedTestCases);
    };

    const argumentCountHandler = e => {
        setInputCount(parseInt(e.target.value, 10));
        
        // Reset types
        const updatedTypes = []
        for (let i = 0; i < parseInt(e.target.value, 10); i += 1) {
            updatedTypes.push("Integer");
        }
        setTypes(updatedTypes);

        if (e.target.value) {
            // Update test cases in the event where the argument count decreases.
            const keysToRemove = argumentNames.slice(parseInt(e.target.value, 10));
            const updatedTestCases = testCases.map(testCase => {
                const updatedTestCase = { ...testCase };
                
                keysToRemove.forEach(keyToRemove => {
                    delete updatedTestCase[keyToRemove];
                });
            
                return updatedTestCase;
            });
            setTestCases(updatedTestCases);

            // Remove argument names when argument count decreases
            setArgumentNames(argumentNames.slice(0, parseInt(e.target.value, 10)));
        }
    }

    const typeChangeHandler = (index, e) => {
        const updatedTypes = [...types];
        updatedTypes[index] = e.target.value;
        setTypes(updatedTypes);
    };
    
    return (
        <div className={styles["add-argument-container"]}>
            <InputLabel id="test-cases">Number of arguments in test cases</InputLabel>
            <TextField
                required
                label={"e.g. 3"}
                type="number"
                value={inputCount}
                onChange={e => argumentCountHandler(e)}
            />
            {
                inputCount > 0 && Array.from({ length: inputCount }, (_, index) => (
                    <div key={index} className={styles["argument-container"]}>
                        <TextField
                            required
                            fullWidth
                            id=""
                            label={`Argument ${index} name`}
                            value={argumentNames[index] ? argumentNames[index] : "" }
                            onChange={e => argumentNameChangeHandler(e, index)}
                        />
                        <FormControl>
                            <InputLabel id="type">Type</InputLabel>
                            <Select
                                labelId="type"
                                id="type"
                                value={types[index] ? types[index] : "" }
                                label={`Language ${index + 1}`}
                                onChange={e => typeChangeHandler(index, e)}
                                sx={{ width: 150 }}
                            >
                                <MenuItem value={'Integer'}>Integer</MenuItem>
                                <MenuItem value={'Float'}>Float</MenuItem>
                                <MenuItem value={'String'}>String</MenuItem>
                                <MenuItem value={'Array'}>Array</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                ))
            }
        </div>
    );
};

export default AddArguments;