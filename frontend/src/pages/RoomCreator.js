import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/RoomCreator.module.css";
import { createRoom } from "../api/collaboration";
import Navbar from "../components/Navbar";
import { getRandomQuestion } from "../api/questions";

const RoomCreator = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
    };

    const createRoomHandler = async () => {
        if (!roomId) {
            return;
        }

        const randomQuestion = await getRandomQuestion('Easy'); // todo: need to set difficulty
        createRoom(roomId, randomQuestion._id).then(() => navigate(`/editor/${roomId}`));
    };

    const handleInputEnter = (e) => {
        if (e.code === "Enter") {
            createRoomHandler();
        }
    };

    return (
        <div>
            <Navbar />
            <div className={styles["homePageWrapper"]}>
                <div className={styles["formWrapper"]}>
                    <h4 className={styles["mainLabel"]}>Enter Room</h4>
                    <div className={styles["inputGroup"]}>
                        <input
                            className={styles["inputBox"]}
                            type="text"
                            placeholder="Room ID"
                            onChange={(e) => setRoomId(e.target.value)}
                            value={roomId}
                            onKeyUp={handleInputEnter}
                        />
                        <button
                            className={`${styles["btn"]} ${styles["joinBtn"]}`}
                            onClick={createRoomHandler}
                        >
                            Enter
                        </button>
                        <span className={styles["createInfo"]}>
                            <div
                                onClick={createNewRoom}
                                href="/"
                                className={styles["createNewBtn"]}
                            >
                                Generate a secure room id
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomCreator;
