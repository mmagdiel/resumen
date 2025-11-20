import type { Node, Database } from "@models/core/yii";

import { useState } from "react";
import clsx from "clsx";

import { Icon } from "./Icon"
import { Alert } from "./Alert"
import { Stats } from "./Stats"
import { useLayout, useSchema } from "@/stores";
import { migrationCmdYiiGenerate } from "@services/generators/yii";

type ModalMode = "command" | "load" | "export";

export const Modal = () => {
  const { schema, loadDiagram } = useSchema();
  const { selectedTable, isModalOpen } = useLayout();
  const { handleModalClose, setTable } = useLayout();
  const [mode, setMode] = useState<ModalMode>("command");
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const getCommand = (): string => {
    if (!selectedTable) return "";

    const table = schema.nodes.find((t: Node) => t.id === selectedTable);
    if (!table) return "";

    // Get table names for junction tables
    let table1Name = "";
    let table2Name = "";
    if (table.isJunction && table.junctionTable1 && table.junctionTable2) {
      table1Name = schema.nodes.find((n) => n.id === table.junctionTable1)?.name || "";
      table2Name = schema.nodes.find((n) => n.id === table.junctionTable2)?.name || "";
    }

    return migrationCmdYiiGenerate(
      table.name,
      table.attributes,
      table.hideIdInCommand ?? true,
      table.isJunction,
      table1Name,
      table2Name
    );
  };

  const handleLoadDiagram = () => {
    try {
      setError(null);
      const parsed = JSON.parse(jsonInput) as Database;

      // Validate the structure
      if (!parsed.name || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
        throw new Error("Invalid diagram structure. Expected { name, nodes, edges }");
      }

      loadDiagram(parsed);
      setJsonInput("");
      setMode("command");
      handleModalClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
    }
  };

  const handleModeChange = (newMode: ModalMode) => {
    setMode(newMode);
    setError(null);
    setJsonInput("");
    setCopied(false);
  };

  const handleDownloadDiagram = () => {
    const jsonString = JSON.stringify(schema, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${schema.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyDiagram = async () => {
    const jsonString = JSON.stringify(schema, null, 2);
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExportJson = (): string => {
    return JSON.stringify(schema, null, 2);
  };

  const alertGenerate = "Select a table to obtain the command to run the migration using the Yi command tool"
  const alertLoad = "Paste a JSON diagram following the structure described in the README examples"
  const alertExport = "Export your current diagram to save and share it. Download as a JSON file or copy to clipboard."
  return (
    <dialog
      id="commands_modal"
      className={clsx("modal", isModalOpen && "modal-open")}
    >
      <div className="modal-box w-11/12 max-w-3xl">
        <h3 className="font-bold text-lg mb-4">Yii Migration Designer</h3>

        {/* Mode Toggle */}
        <div role="tablist" className="tabs tabs-boxed mb-4">
          <button
            role="tab"
            className={clsx("tab", mode === "command" && "tab-active")}
            onClick={() => handleModeChange("command")}
          >
            Generate Command
          </button>
          <button
            role="tab"
            className={clsx("tab", mode === "load" && "tab-active")}
            onClick={() => handleModeChange("load")}
          >
            Load Diagram
          </button>
          <button
            role="tab"
            className={clsx("tab", mode === "export" && "tab-active")}
            onClick={() => handleModeChange("export")}
          >
            Export Diagram
          </button>
        </div>

        {/* Command Mode */}
        {mode === "command" && (
          <div className="space-y-4">
            <Alert id="info" label={alertGenerate} size={24} />
            <Stats name={schema.name} nodes={schema.nodes.length} edges={schema.edges.length} />

            <div className="form-control mb-4 flex justify-between">
              <div className="pr-4" style={{width:"96px"}}>
                <label className="label">
                  <span className="label-text">Select Table</span>
                </label>
                <select
                  className="select select-bordered block"
                  value={selectedTable || ""}
                  onChange={setTable}
                  >
                  <option value="" disabled>
                    Select a table
                  </option>
                  {schema.nodes.map((table: Node) => (
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
            </div>
          </div>
        )}

        {/* Load Diagram Mode */}
        {mode === "load" && (
          <div className="space-y-4">
            <Alert id="info" label={alertLoad} size={24} />

            <div className="form-control flex justify-between">
              <div className="flex-1 pr-4">
                <label className="label">
                  <span className="label-text">Diagram JSON</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-64 font-mono text-sm block w-full"
                  placeholder='{\n  "name": "My Diagram",\n  "nodes": [...],\n  "edges": [...]\n}'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={handleLoadDiagram}
                disabled={!jsonInput.trim()}
              >
                Load Diagram
              </button>
            </div>
            {error && ( <Alert id="error" label={error} size={24} /> )}
          </div>
        )}

        {/* Export Diagram Mode  id="success" */}
        {mode === "export" && (
          <div className="space-y-4">
            <Alert id="success" label={alertExport} size={24} />
            <Stats name={schema.name} nodes={schema.nodes.length} edges={schema.edges.length} />

            <div className="form-control flex justify-between">
              <div className="flex-1 pr-4">
                <label className="label">
                  <span className="label-text">Diagram JSON Preview</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-64 font-mono text-sm block w-full"
                  value={getExportJson()}
                  readOnly
                />
              </div>
              <div className="flex flex-col">
                <button
                  className="btn btn-outline mb-2"
                  onClick={handleCopyDiagram}
                >
                  {copied ? (
                    <>
                      <Icon id="check" size={24} />
                      Copied!
                    </>
                  ) : (
                    "Copy to Clipboard"
                  )}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleDownloadDiagram}
                >
                  <Icon id="download" size={24} />
                  Download JSON
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">

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
