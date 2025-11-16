import {Icon} from "../Icon"
import { useLayout } from "@/stores/useLayout";

const Command = () => {
  const { handleModalOpen } = useLayout();
  return (
    <button className="btn btn-primary" onClick={handleModalOpen}>
      <Icon id="eye" size={20} /> 
      Commands
    </button>
  );
};

export { Command };
