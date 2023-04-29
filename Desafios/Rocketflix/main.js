import axios from "axios";

import { API_KEY, BASE_URL, IMG_URL, language } from "./api.js";

axios
  .get(API_KEY)
  .then((responses) => console.log(responses))
  .catch((err) => console.error(err));
