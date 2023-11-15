import axios from "axios";

const baseUrl = process.env.REACT_APP_USER_SERVICE_URL + "/user-service";

const loginUser = (username, password) => {
  const credentials = {
    username,
    password,
  };

  return axios
    .post(baseUrl + "/login", credentials)
    .then((response) => ({
      token: response.data.token,
      username: response.data.username,
      isManager: response.data.isManager,
      status: response.status,
    }))
    .catch((error) => ({
      errorType: error.response.data.errorType,
      message: error.response.data.msg,
      status: error.response.status,
    }));
};

const registerUser = (username, password) => {
  const credentials = {
    username,
    password,
  };

  return axios
    .post(baseUrl + "/register", credentials)
    .then((response) => ({
      message: response.data.msg,
      status: response.status,
    }))
    .catch((error) => ({
      message: [error.response.data.usernameError, error.response.data.passwordError],
      status: error.response.status,
    }));
};

const setAuthenticationHeader = () => {
  return {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("credentials")).sessionToken
      }`,
    },
  };
};

const deregisterUser = () => {
  return axios
    .delete(baseUrl + "/deregister", setAuthenticationHeader())
    .then((res) => ({ status: res.status }))
    .catch((error) => ({ status: error.response.status }));
};

const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axios.put(
      baseUrl + "/update/password",
      { 
        oldPassword,
        newPassword
      },
      setAuthenticationHeader()
    );

    return {
      message: response.data.msg,
      status: response.status,
    }
  } catch (error) {
    return {
      errorLoc: error.response.data.errorLoc,
      message: error.response.data.msg,
      status: error.response.status
    };
  }
};

const getUsername = async () => {
  try {
    const res = await axios.get(baseUrl + '/username', setAuthenticationHeader());

    return res.data.username;
  } catch (e) {
    console.error(e);
  }
}

export { 
  loginUser, 
  registerUser, 
  deregisterUser,
  changePassword,
  getUsername
};
