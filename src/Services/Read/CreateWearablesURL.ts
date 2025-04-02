import axios from 'axios';

/**
 * Hace una solicitud a la API y devuelve un ID basado en los parámetros proporcionados.
 * @param {Object} params Parámetros para la consulta de la API.
 * @returns {Promise<number>} El ID obtenido de la API.
 */
const getIDFromAPI = async (participantId: any, swId: any) => {
  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const wearablesIds = await axios.get(
      `${apiUrl}/sw/wearable-ids/${swId}`,
      config,
    );

    const experimentId = await axios.get(
      `${apiUrl}/participants/experiment-by-participant/${participantId}`,
      config,
    );

    return { experimentId: experimentId.data, wearablesIds: wearablesIds.data };
  } catch (error) {
    console.error('Error fetching ID:', error);
    throw error;
  }
};

export { getIDFromAPI };

const getExperimentIdFromAPI = async (participantId: any) => {
  const accessToken = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_API_URL;

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {

    const experimentId = await axios.get(
      `${apiUrl}/participants/experiment-by-participant/${participantId}`,
      config,
    );

    return { experimentId: experimentId.data};
  } catch (error) {
    console.error('Error fetching ID:', error);
    throw error;
  }
}

export { getExperimentIdFromAPI };

