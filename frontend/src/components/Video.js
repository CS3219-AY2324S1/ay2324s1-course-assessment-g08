import styles from "../styles/components/Video.module.css";
import Draggable from "react-draggable";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const PeerVideo = (props) => {
  const ref = useRef();
  useEffect(() => {
    if (!props.peer) return;

    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <video
      className={styles["video-container"]}
      playsInline
      autoPlay
      ref={ref}
    />
  );
};

function Video(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: -500 });
  const buttonRef = useRef(null);
  const modalRef = useRef(null); // New reference for modal
  const [isVideoOn, setIsVideoOn] = useState(true);
  const streamHolder = useRef();
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.roomId;

  const toggleVideo = () => {
    if (userVideo.current && userVideo.current.srcObject) {
      const videoTracks = userVideo.current.srcObject.getVideoTracks();
      if (videoTracks.length > 0) {
        // Toggle the enabled property of the video track
        videoTracks[0].enabled = !videoTracks[0].enabled;
        // Update the state variable to reflect the new status
        setIsVideoOn(videoTracks[0].enabled);
      }
    }
  };

  useEffect(() => {
    const socketURL = process.env.REACT_APP_COMMUNICATION_SERVICE_URL;
    const path = "/communication-service/socket.io";
    socketRef.current = io(socketURL, {
      path,
      "force new connection": true,
      reconnectionAttempts: 5,
      timeout: 10000,
      transports: ["websocket"],
    }); // Assign socket instance to ref
    console.log("getting camera");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        streamHolder.current = stream;
        console.log("joining");
        toggleVideo();
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          console.log(peers);
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          console.log("Received signal for ID:", payload.id);
          console.log("Current Peers:", peersRef.current);
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          if (item && item.peer) {
            item.peer.signal(payload.signal);
          } else {
            console.error("Peer not found for ID:", payload.id);
          }
        });
        // Add a listener for when a user disconnects
        socketRef.current.on("user-disconnected", (id) => {
          // Find the peer that has disconnected and remove it
          console.log("finding");
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            if (peerObj.peer) {
              peerObj.peer.destroy();
            }
            const newPeerList = peersRef.current.filter((p) => p.peerID !== id);
            peersRef.current = newPeerList;
            setPeers((peers) => peers.filter((p) => p !== peerObj.peer));
          }
        });
      })
      .catch((err) => {
        console.error("Failed to get user media:", err);
      });
    return () => {
      // Stop all media tracks
      console.log(userVideo.current);
      if (streamHolder.current) {
        streamHolder.current.getTracks().forEach((track) => track.stop());
      }

      // Destroy all peer connections

      peersRef.current.forEach((p) => p.peer.destroy());
     
      // Remove socket event listeners
      if (socketRef.current) {
        socketRef.current.off("all users");
        socketRef.current.off("user joined");
        socketRef.current.off("receiving returned signal");
        socketRef.current.off("user-disconnected");

        // Disconnect the socket connection
        if (socketRef.current.connected) {
          socketRef.current.disconnect();
        }
      }
    };
  }, []);

  function turnOffAllMediaStreams() {
    // Get all media elements in the document (videos and audios)
    const mediaElements = document.querySelectorAll("video, audio");

    // Iterate through each media element
    mediaElements.forEach((element) => {
      // Check if the element has an associated MediaStream
      if (element.srcObject) {
        // Get all tracks from the MediaStream
        const tracks = element.srcObject.getTracks();

        // Stop each track
        tracks.forEach((track) => {
          track.stop();
        });

        // Remove the srcObject from the media element
        element.srcObject = null;
      }
    });
  }

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });
    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });
    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Draggable position={null} scale={1} defaultPosition={position}>
        <div
          ref={modalRef}
          className={styles["video-modal"]}
          style={{ display: isOpen ? "block" : "none" }}
        >
          <button onClick={handleClick} className={styles["close-button"]}>
            x
          </button>
          <video
            className={styles["local-video-container"]}
            muted
            ref={userVideo}
            autoPlay
            playsInline
          />
          <div>
            {" "}
            <button onClick={toggleVideo} className={styles["toggle-button"]}>
              {isVideoOn ? "Turn Video Off" : "Turn Video On"}
            </button>
          </div>

          {peers.map((peer, index) => {
            return <PeerVideo key={index} peer={peer} />;
          })}
        </div>
      </Draggable>
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={styles["video-button"]}
      >
        Video<span> ^ </span>
      </button>
    </div>
  );
}

export default Video;
