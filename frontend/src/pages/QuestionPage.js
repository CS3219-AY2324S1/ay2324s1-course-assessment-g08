import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuestionById } from '../api/questions';
import styles from '../styles/pages/QuestionPage.module.css';
import Navbar from '../components/Navbar';
import DOMPurify from 'dompurify';
import UpdateQuestionForm from '../components/UpdateQuestionForm.js';
import Button from '@mui/material/Button';

const QuestionPage = () => {
    const { id } = useParams();

    const [question, setQuestion] = useState({});
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchQuestion = async (id) => {
            const res = await fetchQuestionById(id);

            setQuestion(res);
        };

        fetchQuestion(id);
    }, [id, isVisible]);

    console.log(question);

    return (
        <div>
            <Navbar />
            <div className={styles["container"]}>
                <div className={styles["header-container"]}>
                    <h1>{question.title}</h1>
                    {
                        localStorage.getItem('credentials') && JSON.parse(localStorage.getItem('credentials')).isManager && (<Button 
                                variant="contained"
                                onClick={() => setIsVisible(true)}
                            >
                            Update
                        </Button>)
                    }
                </div>
                <h3>{question.complexity}</h3>
                <h3>{question.category}</h3>
                <div 
                    className={styles["content"]}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.description) }} 
                />
            </div>
            <UpdateQuestionForm
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                question={question}

            />
        </div>
    );
};

export default QuestionPage;