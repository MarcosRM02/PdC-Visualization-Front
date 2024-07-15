import SWDataSingleCard from "./ParticipantSingleCard";
import { IParticipantProp} from "../../Types/Interfaces";

const SWDataCard = ({ participants = [] }: IParticipantProp) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {participants.map((item) => (
        <SWDataSingleCard key={item.id} SWDatas={item} />
      ))}
    </div>
  );
};

export default SWDataCard;
