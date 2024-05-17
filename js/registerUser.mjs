import { get, put, post } from "./http.mjs";

async function registerUser(name, email, password, avatar) {
  if (!email.endsWith("stud.noroff.no")) {
    return;
  }
}
