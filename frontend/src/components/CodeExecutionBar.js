import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from '../styles/components/CodeExecutionBar.module.css';
import LoadingButton from '@mui/lab/LoadingButton';

const CodeExecutionBar = ({ resultsVisible, setResultsVisible, executeCodeHandler, codeRunning }) => {
    return (
        <div className={styles["execution-bar"]}>
            <p className={styles["results-btn"]} onClick={() => setResultsVisible(!resultsVisible)}>
                <span>Console</span>
                {
                    resultsVisible
                        ? <KeyboardArrowDownIcon />
                        : <KeyboardArrowUpIcon />
                }
            </p>
            <LoadingButton
                loading={codeRunning}
                variant="outlined"
                sx={{
                    backgroundColor: 'orange',
                    color: 'black',
                    '&:hover': {
                        backgroundColor: 'darkorange',
                    },
                    borderRadius: '10px',
                    width: '60px',
                    height: '30px',
                    '& .MuiLoadingButton-loadingIndicator': {
                        color: 'blue'
                    }
                }}
                onClick={executeCodeHandler}
            >
                Run
            </LoadingButton>
        </div>
    );
};

export default CodeExecutionBar