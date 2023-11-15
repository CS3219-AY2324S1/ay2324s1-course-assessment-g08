import styles from '../styles/components/RunTimeErrorResult.module.css';

const RunTimeErrorResult = ({ executionResults, resultsVisible }) => {
    return (
        <div className={styles["results-bar"]} style={{ display: resultsVisible ? 'block': 'none' }}>
            <h3 className={styles["runtime-error-header"]}>
                {
                    executionResults.status === "Time Limit Exceeded"
                        ? "Time Limit Exceeded"
                        : "Runtime Error"
                }
            </h3>
            <p className={styles["runtime-error-msg"]}>
                { executionResults.message }
            </p>
        </div>
    );
};

export default RunTimeErrorResult;