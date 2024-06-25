import { WearableDataProps } from "../../Types/Interfaces";

// Voy por aqui, funciona toda la peticion de la API, y lo muestro por el console log, asi que ya falta construir los div

const WearablesData = ({ wearables = [] }: WearableDataProps) => {
  wearables.forEach((wearable: any) => {
    console.log(
      `Wearable ID: ${wearable.WereableId}, Type: ${wearable.wearable_type}`
    );
    Object.keys(wearable.dataframe).forEach((key) => {
      console.log(`Data for ${key}: `, wearable.dataframe[key]);
    });
  });
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <h4>Voy funcionando</h4>
    </div>
  );
};

export default WearablesData;
