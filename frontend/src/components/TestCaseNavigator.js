import styles from '../styles/components/TestCaseNavigator.module.css';

const TestCaseNavigator = ({ inputs, executionResults, selectedTestCase, setSelectedTestCase }) => {
    return (
        <div className={styles["test-cases-btns"]}>
            {
                inputs.map((_, index) => (
                    <button
                        key={index} 
                        onClick={() => setSelectedTestCase(index)} 
                        className={selectedTestCase === index ? styles["test-case-selected"] : styles["test-case-unselected"]}
                    >
                        <p 
                            className={styles["case-btn-text"]}
                            style={{ color: executionResults
                                ? executionResults[index].status === 'Passed' ? 'lightgreen' : '#f1635f'
                                : 'white'
                            }}
                        >
                            Case {index}
                        </p>
                    </button>
                ))
            }
        </div>
    );
};

export default TestCaseNavigator;