import { useState, useEffect } from 'react';
import { runAllTestCases } from '../api/codeExecutor';
import styles from '../styles/components/CodeExecutor.module.css';
import TestCase from './TestCase';
import CodeExecutionBar from './CodeExecutionBar';
import RunTimeErrorResult from './RunTimeErrorResult';
import CodeExecutionNavigator from './CodeExecutionNavigator';
import TestCaseNavigator from './TestCaseNavigator';
import ACTIONS from '../api/actions';
import AllPassModal from './AllPassModal';
import { addAnsweredQuestion } from '../api/history';

const CodeExecutor = ({ 
    socketRef,
    roomId,
    codeRef,
    question, 
    language 
}) => {
    const [resultsVisible, setResultsVisible] = useState(false);
    const [inputs, setInputs] = useState([]);
    const [outputs, setOutputs] = useState([]);
    const [selectedTestCase, setSelectedTestCase] = useState(0);
    const [testCaseBtnSelected, setTestCaseBtnSelected] = useState(true);
    const [allPassModalVisible, setAllPassModalVisible] = useState(false);

    const [executionResults, setExecutionResults] = useState(null);
    const [codeRunning, setCodeRunning] = useState(false);

    const getNowDateTime = () => {
        let newDate = new Date()
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return newDate.toLocaleDateString(undefined, options) + " " + newDate.toLocaleTimeString()
    }

    const executeCodeHandler = async () => {
        setCodeRunning(true);
        socketRef.current.emit(ACTIONS.CODE_EXECUTING, {
            roomId
        });

        const result = await runAllTestCases(codeRef.current, language, inputs, outputs);

        const username = JSON.parse(localStorage.getItem("credentials"))["username"]

        if (Array.isArray(result)) {
            const allPassed = result.every(item => item.status === "Passed");
            if (allPassed) {
                setAllPassModalVisible(true);
            }
        }

        setExecutionResults(result);
        setResultsVisible(true);
        setTestCaseBtnSelected(false);
        setCodeRunning(false);

        socketRef.current.emit(ACTIONS.EXECUTE_CODE, {
            roomId,
            result,
            username
        });
    };

    useEffect(() => {
        if (question && question.testCases) {
            setInputs(question.testCases.map(obj => obj.input));
            setOutputs(question.testCases.map(obj => obj.output));
        }

        setExecutionResults(null);
        setAllPassModalVisible(false);
    }, [question]);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.EXECUTE_CODE, ({ result, username }) => {
                const myUsername = JSON.parse(localStorage.getItem("credentials"))["username"]

                if (Array.isArray(result)) {
                    const allPassed = result.every(item => item.status === "Passed");
                    if (allPassed) {
                        setAllPassModalVisible(true);
                        addAnsweredQuestion(question["_id"], question["title"], question["complexity"], username, myUsername, getNowDateTime(), true, roomId);
                    } else {
                        addAnsweredQuestion(question["_id"], question["title"], question["complexity"], username, myUsername, getNowDateTime(), false, roomId);
                    }
                } else {
                    addAnsweredQuestion(question["_id"], question["title"], question["complexity"], username, myUsername, getNowDateTime(), false, roomId);
                }
                
                setExecutionResults(result);
                setResultsVisible(true);
                setTestCaseBtnSelected(false);
                setCodeRunning(false);
            });

            socketRef.current.on(ACTIONS.CODE_EXECUTING, () => {
                setCodeRunning(true);
            })
        }

        return () => {
            socketRef.current.off(ACTIONS.EXECUTE_CODE);
            socketRef.current.off(ACTIONS.CODE_EXECUTING);
        }
    }, [socketRef.current]);

    return (
        <div className={styles["container"]}>
            {
                executionResults && (executionResults.status === 'Runtime Error' || executionResults.status === 'Time Limit Exceeded')
                    ? (
                        <RunTimeErrorResult 
                            resultsVisible={resultsVisible}
                            executionResults={executionResults}
                        />
                    ) : (
                        <div className={styles["results-bar"]} style={{ display: resultsVisible ? 'block' : 'none' }}>
                            <CodeExecutionNavigator 
                                testCaseBtnSelected={testCaseBtnSelected}
                                setTestCaseBtnSelected={setTestCaseBtnSelected}
                            />
                            <hr />
                            <TestCaseNavigator
                                inputs={inputs}
                                executionResults={executionResults}
                                selectedTestCase={selectedTestCase}
                                setSelectedTestCase={setSelectedTestCase}
                            />
                            <div>
                                {
                                    inputs.map((inputObject, index) => (
                                        <div key={index}>
                                            <TestCase
                                                input={inputObject}
                                                isVisible={selectedTestCase === index}
                                                testCaseResult={executionResults ? executionResults[index] : null}
                                                showExpected={!testCaseBtnSelected}
                                                expected={outputs[index]}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
            }
            <CodeExecutionBar 
                resultsVisible={resultsVisible}
                setResultsVisible={setResultsVisible}
                executeCodeHandler={executeCodeHandler}
                codeRunning={codeRunning}
            />
            <AllPassModal
                isVisible={allPassModalVisible}
                closeHandler={() => setAllPassModalVisible(false)}
            />
        </div>
    );
};

export default CodeExecutor;