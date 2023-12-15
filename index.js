const axios = require('axios');

const DEFAULT_API_BASE_URL = "https://api.phospho.ai";
const DEFAULT_API_VERSION = "/v0";

const BASE_URL = DEFAULT_API_BASE_URL + DEFAULT_API_VERSION;

// index.js
class Phospho {
  /*
    This is the client to post data to the API
    */
  constructor(auth, project_id, baseUrl = BASE_URL) {
    this.auth = auth;
    this.project_id = project_id;
    this.baseUrl = baseUrl;
  }

  async log(input, output) {
    try {
      const url = `${this.baseUrl}/log/${this.project_id}`;
      const data = {
        batched_log_events: [
          {
            project_id: this.project_id,
            input: input,
            output: output,
          },
        ],
      };

      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${this.auth}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error posting log data:", error);
      throw error;
    }
  }

  // More methods comming soon
}

module.exports = Phospho;
