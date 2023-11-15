import styles from '../styles/components/CodeExecutionNavigator.module.css';

const CodeExecutionNavigator = ({ testCaseBtnSelected, setTestCaseBtnSelected }) => {
    return (
        <div className={styles["toggle-btns"]}>
            <button
                className={styles["test-case-btn"]} 
                style={{ color: testCaseBtnSelected ? 'rgb(199, 193, 193)' : 'white'}}
                onClick={() => setTestCaseBtnSelected(true)}
            >
                Testcase
            </button>
            <button 
                className={styles["result-btn"]} 
                style={{ color: testCaseBtnSelected ? 'white' : 'rgb(199, 193, 193)'}}
                onClick={() => setTestCaseBtnSelected(false)}
            >
                Result
            </button>
        </div>
    );
};

export default CodeExecutionNavigator;