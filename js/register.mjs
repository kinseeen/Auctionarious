const baseUrl = "https://v2.api.noroff.dev/";
const apiKey = "c436cff3-b668-4138-8758-e6a5409f9a5f";
  /**
   * Performs a GET request to the specified URL.
   *
   * @param {string} url - The URL to send the GET request to.
   * @param {boolean} [requireAuth=true] - Indicates whether the request requires authentication. Default is true.
   * @returns {Promise<any>} - A promise that resolves to the response data as JSON.
   * @throws {Error} - If the GET request fails.
   */

  async function setToken(url, requireAuth = true) {
    localStorage.setItem(
        "token"
    );
    const token = authorize(requireAuth);

    try {
      const response = await fetch(baseUrl + url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey.data.key,
        },
      });
      const responseAsJson = await response.json();
      return responseAsJson;
    } catch (error) {
      console.error("Failed to fetch data");
      throw error;
    }
  };
