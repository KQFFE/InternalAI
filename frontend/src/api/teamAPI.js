/**
 * Fetches team data from the backend API.
 * @returns {Promise<Object>} A promise that resolves to the team data.
 * @throws {Error} If the network response is not ok.
 */
export const fetchTeam = async () => {
  const response = await fetch('/api/team');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};