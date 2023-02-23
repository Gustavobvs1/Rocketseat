import axios from "axios";

const url = "https://api.github.com/users/Gustavobvs1";

const start = async () => {
  try {
    const user = await axios.get(url);
    const repos = await axios.get(user.data.repos_url);
    console.log(repos.data);
  } catch (e) {
    console.log(e);
  } finally {
    console.log("é nois");
  }
};

start();
