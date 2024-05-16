const baseUrl = "https://v2.api.noroff.dev/";
const apiKey = "c436cff3-b668-4138-8758-e6a5409f9a5f";

async function get(url, requireAuth = true) {
  const token = authorize(requireAuth);

  try {
    const response = await fetch(baseUrl + url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });
    const responseAsJson = await response.json();
    console.log(responseAsJson);
    return responseAsJson;
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
}

async function put(url, body, requireAuth = true) {
  const token = authorize(requireAuth);
  try {
    const response = await fetch(baseUrl + url, {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify(body),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("PUT request failed", error);
    throw error;
  }
}

async function post(url, body, requireAuth = true) {
  const token = authorize(requireAuth);
  try {
    const response = await fetch(baseUrl + url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
        mode: "no-cors",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
}

function authorize(requireAuth) {
  if (!requireAuth) return;
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token saved");
  }
  return token;
}

export { get, put, post };
