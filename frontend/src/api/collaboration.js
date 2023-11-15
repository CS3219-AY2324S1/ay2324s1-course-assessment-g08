import axios from "axios";

const baseUrl = process.env.REACT_APP_COLLABORATION_SERVICE_URL + "/collaboration-service";

const setAuthenticationHeader = () => {
  return {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("credentials")).sessionToken
      }`,
    },
  };
};

const createRoom = (roomId, questionId) => {
  const newRoom = {
    roomId,
    questionId
  };

  return axios
    .post(baseUrl, newRoom, setAuthenticationHeader())
    .then((response) => ({
      message: response.data.msg,
      status: response.status,
    }))
    .catch((error) => ({
      message: error.response.data.msg,
      status: error.response.status,
    }));
};

const getRoomById = async roomId => {
  try {
    const room = await axios.get(baseUrl + `/${roomId}`, setAuthenticationHeader());

    return room.data;
  } catch (error) {
    console.error("Error when trying to fetch room by id: ", error);
  }
}

const updateRoomQuestion = async (roomId, questionId) => {
  try {
    await axios.put(baseUrl + "/room-question", { roomId, questionId}, setAuthenticationHeader());

    return true;
  } catch (error) {
    console.error("Error when trying to update question", error);
    return false;
  }
}

export { 
    createRoom,
    getRoomById,
    updateRoomQuestion
};
