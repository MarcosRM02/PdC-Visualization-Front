import axios from 'axios';

const getIDFromAPI = async (participantId: any, swId: any) => {
  try {
    const wearablesIds = await axios.get(`sw/wearable-ids/${swId}`);

    const experimentId = await axios.get(
      `participants/experiment-by-participant/${participantId}`,
    );

    return { experimentId: experimentId.data, wearablesIds: wearablesIds.data };
  } catch (error) {
    console.error('Error fetching ID:', error);
    throw error;
  }
};

export { getIDFromAPI };

const getExperimentIdFromAPI = async (participantId: any) => {
  try {
    const experimentId = await axios.get(
      `participants/experiment-by-participant/${participantId}`,
    );

    return { experimentId: experimentId.data };
  } catch (error) {
    console.error('Error fetching ID:', error);
    throw error;
  }
};

export { getExperimentIdFromAPI };
