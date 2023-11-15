import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import CategoryDropdown from './CategoryDropdown';
import InputLabel from '@mui/material/InputLabel';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import styles from '../styles/components/AddQuestionForm.module.css';
import { addQuestion } from '../api/questions';
import AddQuestionTitle from './AddQuestionTitle';
import AddComplexity from './AddComplexity';
import AddCodeTemplate from './AddCodeTemplate';
import AddArguments from './AddArguments';
import AddOutput from './AddOutput';
import AddTestCase from './AddTestCase';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddQuestionForm = ({ isVisible, setIsVisible}) => {
    const [description, setDescription] = useState(EditorState.createEmpty());
    const [title, setTitle] = useState("");
    const [categories, setCategories] = useState([]);
    const [complexity, setComplexity] = useState("Easy");
    const [errorMessage, setErrorMessage] = useState("");
    const [codeTemplateFields, setCodeTemplateFields] = useState([
        { language: 'Python', template: '' }
    ]);
    const [inputCount, setInputCount] = useState(0);
    const [argumentNames, setArgumentNames] = useState([])
    const [testCases, setTestCases] = useState([]);
    const [expectedOutputs, setExpectedOutputs] = useState([]);
    const [types, setTypes] = useState([]);
    const [outputType, setOutputType] = useState("Integer");

    const submitHandler = async e => {
        e.preventDefault();

        const stringifiedDescription = draftToHtml(convertToRaw(description.getCurrentContent()));
        
        // checks for no empty fields
        if (stringifiedDescription.trim() === "<p></p>" || title.trim().length === 0 || 
            categories.length === 0 || codeTemplateFields.length === 0 || codeTemplateFields.length === 0) {
            setErrorMessage("Submit failed. All fields must be filled");
            return;
        }

        // Checks that only 1 code template per language, and template is not empty.
        const uniqueKeys = new Set();
        for (const template of codeTemplateFields) {
            for (const language in template) {
                if (template[language].trim() === "") {
                    setErrorMessage("Code template cannot be empty");
                    return;
                }

                if (uniqueKeys.has(template[language])) {
                    setErrorMessage("Submit failed. Each language can only have 1 code template");
                    return;
                }

                uniqueKeys.add(template[language]);
            }
        }

        // Check that arguments are not an empty string
        if (argumentNames.length === 0) {
            setErrorMessage("There must be more than 1 argument in test case");
            return;
        }

        if (argumentNames.length !== inputCount) {
            setErrorMessage("Missing some arguments, make sure they are filled!");
            return;
        }

        for (const argumentName of argumentNames) {
            if (argumentName.trim() === "") {
                setErrorMessage("All argument names must be filled!");
                return;
            }
        }

        // Checks the inputs to make sure that there are no empty strings
        if (testCases.length === 0) {
            setErrorMessage("There must be at least 1 test case");
            return;
        }

        for (const testCase of testCases) {
            if (JSON.stringify(testCase) === "{}") {
                setErrorMessage("Test case cannot be empty!");
                return;
            }

            for (const propertyName in testCase) {
                if (testCase[propertyName].trim() === "") {
                    setErrorMessage("Test case cannot be empty!");
                    return;
                }
            }
          }
          

        // Checks that expected outputs are not empty
        for (const output of expectedOutputs) {
            if (output.trim() === "" || output.replace(/^"|"$/g, '') === "") {
                setErrorMessage("Expected output cannot be empty!");
                return;
            }
        }

        // Converting expected outputs to valid format
        const expectedOutputsArr = []
        for (let output of expectedOutputs) {
            if (outputType === 'Integer') {
                output = parseInt(output, 10); // The second argument (base) is optional but recommended to avoid unexpected behavior.

                if (isNaN(output)) {
                    setErrorMessage("Some outputs are specified as integer but the value given is not an integer!");
                    return;
                }
            } else if (outputType === 'Float') {
                output = parseFloat(output);

                if (isNaN(output)) {
                    setErrorMessage("Some outputs are specified as float but the value given is not a float!");
                }
            } else if (outputType === 'Array') {
                try {
                    output = JSON.parse(output);
                    
                    if (!Array.isArray(output)) {
                        setErrorMessage("Some inputs are specified as array but the value given is not an array!");
                        return;
                    }
                } catch (error) {
                    setErrorMessage("Some outputs are specified as array but the value given is not an array!");
                    return;
                }
            } else if (outputType === 'String') {
                output = output.replace(/^"|"$/g, '');
            }

            expectedOutputsArr.push(output);
        }

        // Converted test case inputs to valid format
        const argNameToTypeMap = {}
        for (let i = 0; i < argumentNames.length; i += 1) {
            argNameToTypeMap[argumentNames[i]] = types[i];
        }

        const testCaseInputsArr = []
        for (const testCase of testCases) {
            const testCaseObj = {}
            for (const argName in testCase) {
                const argType = argNameToTypeMap[argName];
                let value = testCase[argName];
                if (argType === "Integer") {
                    value = parseInt(value, 10);

                    if (isNaN(value)) {
                        setErrorMessage("Some inputs are specified as integer but the value given is not an integer!");
                        return;
                    }
                } else if (argType === "Float") {
                    value = parseFloat(value);

                    if (isNaN(value)) {
                        setErrorMessage("Some inputs are specified as float but the value given is not a float!");
                    }
                } else if (argType === "Array") {
                    try {
                        value = JSON.parse(value);
    
                        if (!Array.isArray(value)) {
                            setErrorMessage("Some inputs are specified as array but the value given is not an array!");
                            return;
                        }
                    } catch (err) {
                        setErrorMessage("Some inputs are specified as array but the value given is not an array!");
                        return;
                    }
                } else if (argType === "String") {
                    value = value.replace(/^"|"$/g, '');
                }

                testCaseObj[argName] = value;
            }

            testCaseInputsArr.push(testCaseObj);
        }

        const response = await addQuestion(
            title, 
            categories, 
            complexity, 
            stringifiedDescription, 
            testCaseInputsArr, 
            expectedOutputsArr,
            codeTemplateFields
        );

        if (response.status !== 201) {
            setErrorMessage(response.message);
            return;
        }
        
        // Reset form
        setIsVisible(false);
        setErrorMessage("");
        setTitle("");
        setDescription(EditorState.createEmpty());
        setCategories([]);
        setComplexity("Easy")
        setCodeTemplateFields([ { language: 'Python', template: '' } ]);
        setInputCount(0);
        setArgumentNames([""]);
        setTestCases([]);
        setExpectedOutputs([]);
        setTypes([]);
        setOutputType("Integer");
    };


    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <div>
            <Dialog
                fullScreen
                open={isVisible}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Add Question
                        </Typography>
                        <Button autoFocus color="inherit" onClick={submitHandler}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box component="form" noValidate sx={{ mt: 1, margin: '50px' }} style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    { errorMessage &&
                        <p className={styles["error-msg"]}>{errorMessage}</p>
                    }
                    <AddQuestionTitle title={title} setTitle={setTitle} />
                    <CategoryDropdown
                        selectedCategories={categories}
                        setCategories={setCategories} 
                    />
                    <AddComplexity complexity={complexity} setComplexity={setComplexity} />
                    <InputLabel id="question-description">Question Description</InputLabel>
                    <Editor
                        labelId="question-description"
                        editorState={description}
                        wrapperClassName={styles["description-wrapper"]}
                        editorClassName={styles["description-editor"]}
                        onEditorStateChange={description => setDescription(description)}
                        editorStyle={{ height: '200px', overflowY: 'auto' }}
                    />
                    <AddCodeTemplate codeTemplateFields={codeTemplateFields} setCodeTemplateFields={setCodeTemplateFields}/>
                    <AddArguments 
                        inputCount={inputCount}
                        setInputCount={setInputCount}
                        argumentNames={argumentNames}
                        setArgumentNames={setArgumentNames}
                        testCases={testCases}
                        setTestCases={setTestCases}
                        types={types}
                        setTypes={setTypes}
                    />
                    <AddOutput outputType={outputType} setOutputType={setOutputType} />
                    <AddTestCase 
                        expectedOutputs={expectedOutputs}
                        setExpectedOutputs={setExpectedOutputs}
                        testCases={testCases}
                        setTestCases={setTestCases}
                        argumentNames={argumentNames}
                    />
                </Box>
            </Dialog>
        </div>
    );
}

export default AddQuestionForm;