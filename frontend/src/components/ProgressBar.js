import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const { fetchAllQuestionsComplexities } = require("../api/questions")

const ProgressBar = (userHistory) => {
    const [allQuestions, setAllQuestions] = useState({})
    const [questionData, setQuestionData] = useState({
        easySolved: 0,
        easyTotal: 0,
        mediumSolved: 0,
        mediumTotal: 0,
        hardSolved: 0,
        hardTotal: 0,
        allSolved: 0
    })

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchAllQuestionsComplexities();
            setAllQuestions(res);
        }
        fetchData();
    }, [])

    useEffect(() => {
        const updateData = () => {
            let answerHistory = userHistory["userHistory"]["data"].filter(el => el.isSolved === true).map(el => ({ _id: el["questionId"], complexity: el["complexity"]}) );
            answerHistory = answerHistory.reduce((unique, o) => {
                if(!unique.some(obj => obj.label === o.label && obj.value === o.value)) {
                  unique.push(o);
                }
                return unique;
            },[]);
            const allQuestionsArray = Object.keys(allQuestions).map(key => allQuestions[key]);
            const easyQuestions = allQuestionsArray.filter(el => el.complexity === "Easy")
            const easySolved = answerHistory.filter(x => easyQuestions.some(y => y._id === x._id));
            const mediumQuestions = allQuestionsArray.filter(el => el.complexity === "Medium");
            const mediumSolved = answerHistory.filter(x => mediumQuestions.some(y => y._id === x._id));
            const hardQuestions = allQuestionsArray.filter(el => el.complexity === "Hard");
            const hardSolved = answerHistory.filter(x => hardQuestions.some(y => y._id === x._id));
            const allSolved = easySolved.length + mediumSolved.length + hardSolved.length;
            setQuestionData({
                easySolved: easySolved.length,
                easyTotal: easyQuestions.length,
                mediumSolved: mediumSolved.length,
                mediumTotal: mediumQuestions.length,
                hardSolved: hardSolved.length,
                hardTotal: hardQuestions.length,
                allSolved: allSolved
            });
        }
        updateData();
    }, [allQuestions]);

    function CircularProgressWithLabel(props) {
        return (
          <Box sx={{ position: 'relative', display: 'inline-flex'}}>
            <CircularProgress 
                variant="determinate" 
                {...props} 
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h3" component="div" color="#FFFFFF">
                {questionData.allSolved}
              </Typography>
              <Typography variant="h6" component="div" color="#FFFFFF">
                solved
              </Typography>
            </Box>
          </Box>
        );
    }

    return (
        <div>
            <Box width='100%' display='flex' flexDirection='row' px={2} pb={2}>
                <CircularProgress 
                    variant="determinate"
                    size={160}
                    value={100} 
                    sx={{
                        position: 'absolute',
                        color: "#d4d4d4"
                    }}
                />
                <CircularProgressWithLabel
                    variant="determinate"
                    value={questionData.allSolved}
                    size={160}
                />
                <Box width='100%' display='flex' flexDirection='column' mx={4}>
                    <Box display='flex' justifyContent='space-between' alignItems='center' my={1}>
                        <Typography variant="body">Easy</Typography>
                        <Typography variant="body">{questionData.easySolved} / {questionData.easyTotal}</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={questionData.easySolved}
                        sx={{
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#03c3ac'
                            }
                        }}
                    />
                    <Box display='flex' justifyContent='space-between' alignItems='center' mt={2} mb={1}>
                        <Typography variant="body">Medium</Typography>
                        <Typography variant="body">{questionData.mediumSolved} / {questionData.mediumTotal}</Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate"
                        value={questionData.mediumSolved}
                        sx={{
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: 'darkorange'
                            }
                        }}
                    />
                    <Box display='flex' justifyContent='space-between' alignItems='center' mt={2} mb={1}>
                        <Typography variant="body">Hard</Typography>
                        <Typography variant="body">{questionData.hardSolved} / {questionData.hardTotal}</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={questionData.hardSolved}
                        sx={{
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: 'red'
                            }
                        }}
                    />
                </Box>
            </Box>
        </div>
    )
}

export default ProgressBar;