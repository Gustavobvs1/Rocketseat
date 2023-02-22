import axios from "axios";

Promise.all([
  axios.get("https://api.github.com/users/Gustavobvs1/repos"),
  axios.get("https://api.github.com/users/Gustavobvs1")
])
  .then((responses) => {
    console.log(responses[0].data[0].id);
    console.log(responses[1].data.login);
  })
  .catch((err) => console.log(err));
