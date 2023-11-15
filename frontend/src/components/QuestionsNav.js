import styles from "../styles/components/QuestionsNav.module.css";
import { fetchAllQuestions } from "../api/questions";
import AddQuestionForm from "./AddQuestionForm";

const QuestionsNav = ({ 
    addFormVisible, 
    setAddFormVisible, 
    setQuestions,
    setDeleteSelections,
    deleteQuestionsHandler,
    deleteCheckboxVisible,
    setDeleteCheckboxVisible 
}) => {
    const allBtnHandler = async () => {
        setQuestions(await fetchAllQuestions());
    };

    const complexityBtnHandler = async (complexity) => {
        const questions = await fetchAllQuestions();
        setQuestions(
            questions.filter((question) => question.complexity === complexity)
        );
    };

    const cancelBtnHandler = () => {
        setDeleteCheckboxVisible(false);
        setDeleteSelections([]);
    }

    return (
        <div>
            <nav className={styles["container"]}>
                <ul className={styles["left-buttons-container"]}>
                    <li>
                        <button className={styles["all-button"]} onClick={allBtnHandler}>
                            All
                        </button>
                    </li>
                    <li>
                        <button
                            className={styles["easy-button"]}
                            onClick={async () => complexityBtnHandler("Easy")}
                        >
                            Easy
                        </button>
                    </li>
                    <li>
                        <button
                            className={styles["medium-button"]}
                            onClick={async () => complexityBtnHandler("Medium")}
                        >
                            Medium
                        </button>
                    </li>
                    <li>
                        <button
                            className={styles["hard-button"]}
                            onClick={async () => complexityBtnHandler("Hard")}
                        >
                            Hard
                        </button>
                    </li>
                </ul>
                {
                    localStorage.getItem('credentials') && JSON.parse(localStorage.getItem('credentials')).isManager && (
                        <ul className={styles["right-buttons-container"]}>
                            <li>
                                <button onClick={() => setAddFormVisible(true)}>
                                    Add
                                </button>
                            </li>
                            <li>
                                {
                                    !deleteCheckboxVisible
                                        ? <button onClick={async () => setDeleteCheckboxVisible(true)}>Delete</button>
                                        : <button onClick={async () => deleteQuestionsHandler()}>Confirm</button> 
                                }
                            </li>
                            { 
                                deleteCheckboxVisible &&
                                <li>
                                    <button onClick={cancelBtnHandler}>
                                        Cancel
                                    </button>
                                </li>
                            }
                        </ul>   
                    )
                }
            </nav>
            <AddQuestionForm
                isVisible={addFormVisible}
                setIsVisible={setAddFormVisible}
            />
        </div>
    );
};

export default QuestionsNav;
