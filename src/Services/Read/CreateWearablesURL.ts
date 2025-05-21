import axios from 'axios';

const getIDFromAPI = async (participantId: string, swId: string) => {
  const [wearRes, expRes] = await Promise.all([
    axios.get<number[]>(`/sw/wearable-ids/${swId}`),
    axios.get<any>(`/participants/experiment-by-participant/${participantId}`),
  ]);

  // Normaliza experimentId venga como { experimentId: 42 } o como 42
  const raw = expRes.data;
  const experimentId: number =
    typeof raw === 'object' && raw !== null && 'experimentId' in raw
      ? raw.experimentId
      : Number(raw);

  return {
    wearablesIds: wearRes.data,
    experimentId,
  };
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
