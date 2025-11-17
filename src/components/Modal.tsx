import type { Node, Database } from "@models/core/yii";

import { useState } from "react";
import clsx from "clsx";
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

    return migrationCmdYiiGenerate(table.name, table.attributes, table.hideIdInCommand ?? true);
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
          <>
            <div className="form-control mb-4">
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
          </>
        )}

        {/* Load Diagram Mode */}
        {mode === "load" && (
          <div className="space-y-4">
            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Paste a JSON diagram following the structure described in the
                README examples
              </span>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Diagram JSON</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-64 font-mono text-sm block"
                placeholder='{\n  "name": "My Diagram",\n  "nodes": [...],\n  "edges": [...]\n}'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />
            </div>

            {error && (
              <div className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                className="btn btn-primary"
                onClick={handleLoadDiagram}
                disabled={!jsonInput.trim()}
              >
                Load Diagram
              </button>
            </div>
          </div>
        )}

        {/* Export Diagram Mode */}
        {mode === "export" && (
          <div className="space-y-4">
            <div className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Export your current diagram to save and share it. Download as a
                JSON file or copy to clipboard.
              </span>
            </div>

            <div className="stats shadow w-full">
              <div className="stat">
                <div className="stat-title">Diagram Name</div>
                <div className="stat-value text-2xl">{schema.name}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Tables</div>
                <div className="stat-value text-2xl">{schema.nodes.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Relationships</div>
                <div className="stat-value text-2xl">{schema.edges.length}</div>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Diagram JSON Preview</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-64 font-mono text-sm block"
                value={getExportJson()}
                readOnly
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-outline"
                onClick={handleCopyDiagram}
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download JSON
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
