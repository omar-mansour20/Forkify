import { TIMEOUT_SEC } from './config';

/**
 * Creates a timeout promise that rejects after a given number of seconds.
 * Used to prevent fetch requests from taking too long.
 * @param {number} s - The number of seconds before the request times out.
 * @returns {Promise} A promise that rejects with a timeout error.
 */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Fetches JSON data from a given URL, with a timeout feature.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} The parsed JSON response.
 * @throws Will throw an error if the request fails or the response is not OK.
 */
export const getJSON = async function (url) {
  try {
    // Race between the fetch request and the timeout function
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    
    // Handle HTTP errors
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err; // Re-throw the error to be handled by the caller
  }
};

/**
 * Makes an AJAX request (GET or POST) with optional data upload.
 * @param {string} url - The endpoint URL.
 * @param {Object} [uploadData] - Optional data to be sent in a POST request.
 * @returns {Promise<Object>} The parsed JSON response.
 * @throws Will throw an error if the request fails or the response is not OK.
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    // Conditionally create a fetch request based on whether data is provided
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Race between the fetch request and the timeout function
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    // Handle HTTP errors
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; // Re-throw the error to be handled by the caller
  }
};
