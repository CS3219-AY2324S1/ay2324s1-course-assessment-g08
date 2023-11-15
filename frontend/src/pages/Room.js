import React, { useState, useEffect, useRef } from "react";
import ACTIONS from "../api/actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { createSocketConnection } from "../sockets/collaborationServiceSocket";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/pages/Room.module.css";
import RoomQuestion from "../components/RoomQuestion";
import CodeExecutor from "../components/CodeExecutor";
import { getRoomById } from "../api/collaboration";
import { fetchQuestionById } from "../api/questions";
import Chat from "../components/Chat";
import Video from "../components/Video";
import AiChat from "../components/AiChat";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ChangeQuestionButton from "../components/ChangeQuestionButton";
const languageToTemplateKeyMap = {
  python: "Python",
  javascript: "Javascript",
  "text/x-ruby": "Ruby",
};

const Room = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [question, setQuestion] = useState({});
  const [language, setLanguage] = useState("python");
  const [questionChanged, setQuestionChanged] = useState(false);
  const [users, setUsers] = useState([]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    socketRef.current.emit(ACTIONS.CHANGE_LANGUAGE, {
      roomId,
      language: e.target.value,
    });
  };

  useEffect(() => {
    const init = async () => {
      const token = JSON.parse(
        localStorage.getItem("credentials")
      ).sessionToken;

      socketRef.current = createSocketConnection(token, roomId);
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        alert("Unauthorized");
        reactNavigator("/");
      }

      const timeout = setTimeout(() => {
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
        });
      }, 500);

      socketRef.current.on(ACTIONS.JOIN_FAILED, () => {
        alert("Full capacity reached");
        reactNavigator("/");
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        console.log(`${username} left the room.`);
        setClients((prevClients) =>
          prevClients.filter((client) => client.socketId !== socketId)
        );
        setUsers(prevUsers =>
          prevUsers.filter(u => username !== username)
        );
      });

      socketRef.current.on("disconnect", () => {
        console.log("Collaboration WebSocket disconnected");
        socketRef.current.close();
      });

      return () => {
        clearTimeout(timeout);
      };
    };

    if (socketRef.current === null) {
      init();
    }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId, fromSocket }) => {
          console.log(`${username} joined the room.`);

          setClients(clients);
          setUsers([...users.filter(u => u.name === username), username]);

          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });

          if (fromSocket !== socketId) {
            socketRef.current.emit(ACTIONS.CHANGE_LANGUAGE, {
              roomId,
              language,
            });
          }
        }
      );
    }
  }, [socketRef.current, language]);

  useEffect(() => {
    const fetchQuestion = async () => {
      const room = await getRoomById(roomId);
      if (!room) {
        return;
      }

      const question = await fetchQuestionById(room.questionId);
      setQuestion(question);
    };

    fetchQuestion();
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      console.log("Room ID copied to clipboard!");
    } catch (error) {
      console.log("Failed to copy room ID to clipboard!");
      console.log(error);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
    socketRef.current.disconnect();
  }

  return (
    <div className={styles["container"]}>
      <nav className={styles["header"]}>
        <div className={styles["clients-list"]}>
          {clients.map((client) => (
            <Client key={client.socketId} username={client.username} />
          ))}
        </div>
        <div className={styles["btn-group"]}>
          <ChangeQuestionButton
            socketRef={socketRef}
            setQuestion={setQuestion}
            roomId={roomId}
            currentQuestionId={question._id}
            setQuestionChanged={setQuestionChanged}
          />
          <button
            className={`${styles["btn"]} ${styles["copy-btn"]}`}
            onClick={copyRoomId}
          >
            Copy Room ID
          </button>
          <button
            className={`${styles["btn"]} ${styles["leave-btn"]}`}
            onClick={leaveRoom}
          >
            Leave Room
          </button>
        </div>
      </nav>
      <div className={styles["main-wrap"]}>
        <div className={styles["left-column"]}>
          <RoomQuestion question={question} />
          <div className={styles["communication"]}>
            <Chat roomId={roomId} />
            <Video roomId={roomId} />
            <AiChat />
          </div>
        </div>
        <div className={styles["right-column"]}>
          <Box sx={{ minWidth: 200 }}>
            <FormControl sx={{ borderColor: "white" }}>
              <InputLabel id="language" sx={{ color: "white" }}>
                Language
              </InputLabel>
              <Select
                labelId="language"
                id="language"
                value={language}
                label="Language"
                onChange={handleLanguageChange}
                labelstyle={{ color: "#ff0000" }}
                sx={{
                  marginBottom: "5px",
                  height: "45px",
                  width: "150px",
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  ".MuiSvgIcon-root ": {
                    fill: "white !important",
                  },
                }}
              >
                <MenuItem value={"python"}>Python</MenuItem>
                <MenuItem value={"javascript"}>Javascript</MenuItem>
                <MenuItem value={"text/x-ruby"}>Ruby</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <div className={styles["right-column"]}>
            <Editor
              socketRef={socketRef}
              roomId={roomId}
              onCodeChange={(code) => {
                codeRef.current = code;
              }}
              codeTemplate={
                question.codeTemplate &&
                question.codeTemplate.templates &&
                question.codeTemplate.templates[
                  languageToTemplateKeyMap[language]
                ]
                  ? question.codeTemplate.templates[
                      languageToTemplateKeyMap[language]
                    ]
                  : ""
              }
              language={language}
              setLanguage={setLanguage}
              questionChanged={questionChanged}
              setQuestionChanged={setQuestionChanged}
            />
            <CodeExecutor
              socketRef={socketRef}
              roomId={roomId}
              codeRef={codeRef}
              question={question}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
