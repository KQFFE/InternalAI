import { useState, useEffect } from 'react';
import { fetchTeam } from '../api/teamAPI';

/**
 * Custom hook to fetch and manage team data.
 * @returns {{team: Array, loading: boolean, error: Error|null}}
 */
export const useTeamData = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchTeam();
        setTeam(result.data); // The API returns an object with a 'data' property
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return { team, loading, error };
};