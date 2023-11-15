import DOMPurify from 'dompurify';
import styles from '../styles/components/RoomQuestion.module.css';

const RoomQuestion = ({ question }) => {
    return (
        <div>
            <h1>{question.title}</h1>
            <h3>{question.complexity}</h3>
            <h3>{question.category}</h3>
            <div 
                className={styles["content"]}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.description) }} 
            />
        </div>
    );
};

export default RoomQuestion;