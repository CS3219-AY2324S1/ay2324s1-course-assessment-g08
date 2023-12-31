import React from "react";
import Avatar from "react-avatar";
import styles from '../styles/components/Client.module.css';

const Client = ({ username }) => {
    return (
        <div className={styles["client"]}>
            <Avatar name={username} size={50} round="14px" />
            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;
