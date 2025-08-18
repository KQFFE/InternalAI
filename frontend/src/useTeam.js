import { useState, useEffect } from 'react';

export function useTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/team.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok while fetching team.json');
        }
        return response.json();
      })
      .then(data => {
        setTeam(data);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { team, loading, error };
}