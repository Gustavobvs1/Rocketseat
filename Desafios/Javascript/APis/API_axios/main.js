const url = "http://localhost:5500/api";

const newUser = {
  name: "Claudio",
  avatar: "http://lorempixel.com.br/400/200",
  city: "Rio de Janeiro",
};

const updatedUser = {
  name: "Marilene",
  avatar: "http://lorempixel.com.br/400/200",
  city: "Salvador",
};

const getUsers = () => {
  axios
    .get(url)
    .then((response) => {
      console.log(response.data);
      apiResult.textContent = JSON.stringify(response.data);
    })
    .catch((err) => console.log(err));
};

const addNewUser = (newUser) => {
  axios
    .post(url, newUser)
    .then()
    .catch((err) => console.log(err));
};

const getUser = (id) => {
  axios
    .get(`${url}/${id}`)
    .then((response) => {
      const data = response.data;
      userName.textContent = data.name;
      userID.textContent = data.id;
      userImage.src = data.avatar;
      userCity.textContent = data.city;
    })
    .catch((err) => console.log(err));
};

const updateUser = (id, updatedUser) => {
  axios
    .put(`${url}/${id}`, updatedUser)
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
};

const deleteUser = (id) => {
  axios
    .delete(`${url}/${id}`)
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
};

getUsers();
// addNewUser(newUser);
getUser(5);
// updateUser(5, updatedUser);
// deleteUser(4);
