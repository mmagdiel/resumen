import type { Table } from "@models/core/yii";

import clsx from "clsx";
import { useLayout, useSchema } from "@/stores";
import { migrationCmdYiiGenerate } from "@services/generators/yii";

export const Modal = () => {
  const { schema } = useSchema();
  const { selectedTable, isCmdModalOpen } = useLayout();
  const { handleModalClose, setTable } = useLayout();
  const getCommand = (): string => {
    if (!selectedTable) return "";

    const table = schema.tables.find((t: Table) => t.id === selectedTable);
    if (!table) return "";

    return migrationCmdYiiGenerate(table.name, table.attributes);
  };
  return (
    <dialog
      id="commands_modal"
      className={clsx("modal", isCmdModalOpen && "modal-open")}
    >
      <div className="modal-box w-11/12 max-w-3xl">
        <h3 className="font-bold text-lg mb-4">Yii Migration Commands</h3>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Select Table</span>
          </label>
          <select
            className="select select-bordered"
            value={selectedTable || ""}
            onChange={setTable}
          >
            <option value="" disabled>
              Select a table
            </option>
            {schema.tables.map((table: Table) => (
              <option key={table.id} value={table.id}>
                {table.name}
              </option>
            ))}
          </select>
        </div>

        {selectedTable && (
          <div className="bg-base-300 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap break-all text-sm">
              {getCommand()}
            </pre>
            <div className="flex justify-end mt-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => navigator.clipboard.writeText(getCommand())}
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={handleModalClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleModalClose}>close</button>
      </form>
    </dialog>
  );
};
