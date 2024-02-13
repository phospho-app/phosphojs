import axios from "axios";

import { UserFeedback } from "./types";
import { BASE_URL } from "./config";

/**
 * Flag a task already logged to phospho as a `success` or a `failure`. This is useful to collect human feedback.
 *
 * Note: Feedback can be directly logged with `phospho.log` by passing `flag` as a keyword argument.
 *
 * @param projectId The project id. Get it from the phospho dashboard.
 * @param taskId The task id. Get the taskId from the returned value of phospho.log, use phospho.newTask to generate a new task id, or use pospho.latestTaskId
 * @param flag The flag to set, either `success` or `failure`
 * @param notes Optional notes to add to the task. For example, the reason for the flag.
 * @param source Optional source of the flag. For example, the name of the user who flagged the task.
 * @param rawFlag Optional raw flag. If flag is not specified, rawFlag is used to determine the flag. For example, if rawFlag is "👍", then flag is "success".
 * @param rawFlagToFlag Optional function to convert rawFlag to flag. By default, "success", "👍", "🙂", "😀" are set to be "success"
 * @param baseUrl Optional base url for the phospho server. By default, it is set to the phospho server.
 * @returns The updated task
 */
const sendUserFeedback = async ({
  projectId,
  taskId,
  flag,
  notes,
  source,
  rawFlag,
  rawFlagToFlag,
  baseUrl,
}: UserFeedback) => {
  if (!projectId) {
    // Raise warning
    console.warn(
      "projectId must be specified when calling user_feedback. Nothing logged"
    );
    return;
  }
  if (!baseUrl) {
    baseUrl = BASE_URL;
  }

  if (!flag) {
    if (!rawFlag) {
      // Raise warning
      console.warn(
        "Either flag or raw_flag must be specified when calling user_feedback. Nothing logged"
      );
      return;
    } else {
      if (!rawFlagToFlag) {
        // Default rawFlagToFlag function
        rawFlagToFlag = (rawFlag: string) => {
          if (["success", "👍", "🙂", "😀"].includes(rawFlag)) {
            return "success";
          } else {
            return "failure";
          }
        };
      }
      // Convert rawFlag to flag
      flag = rawFlagToFlag(rawFlag);
    }
  }

  const updatedTask = await axios
    .post(`${BASE_URL}/tasks/${taskId}/flag`, {
      flag: flag,
      notes: notes,
      source: source,
      project_id: projectId,
    })
    .then((response) => {
      return response.data;
    });

  return updatedTask;
};

export { sendUserFeedback };
