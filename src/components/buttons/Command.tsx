import { useLayout } from "@/stores/useLayout";

const Command = () => {
  const { handleModalOpen } = useLayout();
  return (
    <button className="btn btn-primary" onClick={handleModalOpen}>
      View All Commands
    </button>
  );
};

export { Command };
