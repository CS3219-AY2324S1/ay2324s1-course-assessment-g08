import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styles from '../styles/components/AddQuestionForm.module.css';
import AddIcon from '@mui/icons-material/Add';

const AddCodeTemplate = ({ codeTemplateFields, setCodeTemplateFields }) => {
    const updateCodeTemplate = (index, field, event) => {
        const values = [...codeTemplateFields];
        values[index][field] = event.target.value;
        setCodeTemplateFields(values);
    };

    const addCodeTemplate = () => {
        setCodeTemplateFields([...codeTemplateFields, { language: 'Python', template: '' }]);
    };

    const removeCodeTemplate = index => {
        let data = [...codeTemplateFields];
        data.splice(index, 1);
        setCodeTemplateFields(data);
    };
    
    return (
        <div className={styles["template-container"]}>
            <InputLabel id="code-template">
                Code Boilerplates
            </InputLabel>
            <div className={styles["code-template-outer"]}>
                {codeTemplateFields.map((field, index) => (
                    <div key={index} className={styles["code-template-container"]}>
                        <FormControl>
                            <InputLabel id="code-language">Language</InputLabel>
                            <Select
                                labelId="code-language"
                                id="code-language"
                                value={field.language ? field.language: "" }
                                label={`Language ${index + 1}`}
                                onChange={e => updateCodeTemplate(index, 'language', e)}
                                sx={{ width: 150 }}
                            >
                                <MenuItem value={'Python'}>Python</MenuItem>
                                <MenuItem value={'Ruby'}>Ruby</MenuItem>
                                <MenuItem value={'Javascript'}>Javascript</MenuItem>
                            </Select>
                        </FormControl>
                        <textarea
                            placeholder={`Code Template ${index + 1}`}
                            value={field.template ? field.template: "" }
                            onChange={(e) => updateCodeTemplate(index, 'template', e)}
                            cols={50}
                            className={styles["code-template-textarea"]}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => removeCodeTemplate(index)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={addCodeTemplate}
                    startIcon={<AddIcon />}
                >
                    Add Code Template
                </Button>
            </div>
        </div>
    );
};

export default AddCodeTemplate;