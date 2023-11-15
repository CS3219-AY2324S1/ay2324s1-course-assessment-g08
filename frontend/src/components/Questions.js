import { useEffect, useState } from "react";
import QuestionsNav from "./QuestionsNav";
import { Link } from "react-router-dom";
import { fetchAllQuestions, deleteQuestionsByIds } from "../api/questions";
import styles from "../styles/components/Questions.module.css";
import ReactPaginate from 'react-paginate';

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [deleteSelections, setDeleteSelections] = useState([]);
    const [addFormVisible, setAddFormVisible] = useState(false);
    const [deleteCheckboxVisible, setDeleteCheckboxVisible] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const questionsPerPage = 15;

    useEffect(() => {
        const getQuestions = async () => {
            const res = await fetchAllQuestions();
            setQuestions(res);
        };
        
        getQuestions();
    }, [deleteSelections, addFormVisible]);

    const handleCheckbox = (deleteId) => {
        if (deleteSelections.includes(deleteId)) {
            setDeleteSelections(deleteSelections.filter(id => id !== deleteId));
        } else {
            setDeleteSelections([...deleteSelections, deleteId]);
        }
    };

    const deleteQuestionsHandler = async () => {
        await deleteQuestionsByIds(deleteSelections);
        setDeleteSelections([]);
        setDeleteCheckboxVisible(false);
    };

    const pageCount = Math.ceil(questions.length / questionsPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const displayedQuestions = questions.slice(
        pageNumber * questionsPerPage,
        (pageNumber + 1) * questionsPerPage
    );

    console.log(pageCount);

    return (
        <div className={styles["container"]}>
            <QuestionsNav
                addFormVisible={addFormVisible}
                setAddFormVisible={setAddFormVisible}
                setQuestions={setQuestions}
                deleteQuestionsHandler={deleteQuestionsHandler}
                deleteCheckboxVisible={deleteCheckboxVisible}
                setDeleteCheckboxVisible={setDeleteCheckboxVisible}
                setDeleteSelections={setDeleteSelections}
            />
            <hr className={styles["horizontal-line"]} />
            <table className={styles["questions-table"]}>
                <thead>
                    <tr>
                        <th className={styles["title-column"]}>Title</th>
                        <th className={styles["category-column"]}>Category</th>
                        <th className={styles["complexity-column"]}>Complexity</th>
                        {
                            deleteCheckboxVisible &&
                                <th>Delete</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {displayedQuestions &&
                        displayedQuestions.map((question, index) => (
                            <tr key={question._id}>
                                <td title={question.title} className={styles["title-column"]}>
                                    <Link
                                        to={`/questions/${question._id}`}
                                        className={styles["question-link"]}
                                    >
                                       {index + 1 + pageNumber * questionsPerPage}. {question.title}
                                    </Link>
                                </td>
                                <td className={styles["category-column"]}>
                                    <div className={styles["category-values"]}>
                                        {
                                            question.categories && question.categories.map(category => category).join(', ')
                                        }
                                    </div>
                                </td>
                                <td className={styles["complexity-column"]}>
                                    <span className={complexityColorStyles[question.complexity]}>
                                        {question.complexity}
                                    </span>
                                </td>
                                <td className={styles["delete-column"]}>
                                    { deleteCheckboxVisible &&
                                        <input
                                            type="checkbox"
                                            onChange={() => handleCheckbox(question._id)}
                                        />
                                    }
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={changePage}
                forcePage={pageNumber}
                containerClassName={styles['pagination']}
                activeClassName={styles['active']}
            />
        </div>
    );
};

const complexityColorStyles = {
    Easy: styles["easy-complexity"],
    Medium: styles["medium-complexity"],
    Hard: styles["hard-complexity"],
};

export default Questions;