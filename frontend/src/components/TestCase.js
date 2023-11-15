import styles from '../styles/components/TestCase.module.css';

const TestCase = ({ 
    input, 
    isVisible,
    testCaseResult, 
    showExpected, 
    expected 
}) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div>
            {
                Object.entries(input).map(([key, value]) => (
                    <div key={key}>
                        <p>
                            {key}= 
                        </p>
                        <div className={styles["arg-value"]}>
                        { Array.isArray(value) ? JSON.stringify(value) : value }
                        </div>
                    </div>
                ))
            }

            {
                showExpected && (
                    <div>
                        <p>
                            Output=
                        </p>
                        <div className={styles["arg-value"]}>
                            { testCaseResult ? testCaseResult.message : "Run to see output"}
                        </div>
                        <p>
                            Expected=
                        </p>
                        <div className={styles["arg-value"]}>
                            { Array.isArray(expected) ? JSON.stringify(expected) : expected }
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default TestCase;