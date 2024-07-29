// apiService.js
import axios from 'axios';

/**
 * Hace una solicitud a la API y devuelve un ID basado en los parámetros proporcionados.
 * @param {Object} params Parámetros para la consulta de la API.
 * @returns {Promise<number>} El ID obtenido de la API.
 */
const getIDFromAPI = async (participantId, swId) => {
  const accessToken = sessionStorage.getItem('accessToken');
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const wearablesIds = await axios.get(
      `http://172.18.0.4:3000/sw/wearable-ids/${swId}`,
      config,
    );

    const experimentId = await axios.get(
      `http://172.18.0.4:3000/participants/experiment-by-participant/${participantId}`,
      config,
    );

    return { experimentId: experimentId.data, wearablesIds: wearablesIds.data };
  } catch (error) {
    console.error('Error fetching ID:', error);
    throw error;
  }
};

export { getIDFromAPI };
