import type { FC } from "react";

import type { NodeFormValues } from "../../models";

import { useForm } from "react-hook-form";
import { useSchema } from "../../stores";

interface NodeProps {
  tableId?: string;
  onSubmit: () => void;
}

const NodeForm: FC<NodeProps> = ({ tableId, onSubmit }) => {
  const { schema, addNode, updateNode } = useSchema();

  // Find table if editing
  const table = tableId
    ? schema.nodes.find((t) => t.id === tableId)
    : undefined;

  // Set up form with default values
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NodeFormValues>({
    defaultValues: table
      ? {
          name: table.name,
          description: table.description,
          withTimestamps: table.withTimestamps || false,
          withBlameable: table.withBlameable || false,
          hideIdInCommand: table.hideIdInCommand ?? true,
          isJunction: table.isJunction || false,
          junctionTable1: table.junctionTable1 || "",
          junctionTable2: table.junctionTable2 || "",
        }
      : {
          name: "",
          description: "",
          withTimestamps: false,
          withBlameable: false,
          hideIdInCommand: true,
          isJunction: false,
          junctionTable1: "",
          junctionTable2: "",
        },
  });

  // Watch junction-related fields
  const isJunction = watch("isJunction");
  const junctionTable1 = watch("junctionTable1");
  const junctionTable2 = watch("junctionTable2");

  // Auto-generate name for junction tables
  if (isJunction && junctionTable1 && junctionTable2) {
    const table1Name = schema.nodes.find((n) => n.id === junctionTable1)?.name || "";
    const table2Name = schema.nodes.find((n) => n.id === junctionTable2)?.name || "";
    if (table1Name && table2Name) {
      const generatedName = `${table1Name}_and_${table2Name}`;
      if (watch("name") !== generatedName) {
        setValue("name", generatedName);
      }
    }
  }

  // Get available tables for junction table selection (exclude current table if editing)
  const availableTables = schema.nodes.filter((node) => node.id !== tableId);

  // Submit handler
  const handleFormSubmit = (data: NodeFormValues) => {
    if (tableId) {
      updateNode(tableId, data);
    } else {
      addNode(data);
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <h3 className="text-lg font-bold">
        {tableId ? "Edit Table" : "Add Table"}
      </h3>

      <div className="form-control">
        <label className="label cursor-pointer justify-start space-x-2">
          <input
            type="checkbox"
            className="checkbox"
            {...register("isJunction")}
          />
          <div className="tooltip" data-tip="Junction table for many-to-many relationships">
            <span className="label-text">Junction Table</span>
          </div>
        </label>
      </div>

      {!isJunction && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">Table Name</span>
          </label>
          <input
            type="text"
            className={`input input-bordered ${errors.name ? "input-error" : ""}`}
            {...register("name", {
              required: "Table name is required",
              pattern: {
                value: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                message:
                  "Table name must start with a letter and contain only letters, numbers, and underscores",
              },
            })}
          />
          {errors.name && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.name.message}
              </span>
            </label>
          )}
        </div>
      )}

      {isJunction && (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text">First Table</span>
            </label>
            <select
              className={`select select-bordered ${errors.junctionTable1 ? "select-error" : ""}`}
              {...register("junctionTable1", {
                required: "First table is required for junction table",
              })}
            >
              <option value="">Select a table</option>
              {availableTables.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
            {errors.junctionTable1 && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.junctionTable1.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Second Table</span>
            </label>
            <select
              className={`select select-bordered ${errors.junctionTable2 ? "select-error" : ""}`}
              {...register("junctionTable2", {
                required: "Second table is required for junction table",
              })}
            >
              <option value="">Select a table</option>
              {availableTables.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
            {errors.junctionTable2 && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.junctionTable2.message}
                </span>
              </label>
            )}
          </div>

          {junctionTable1 && junctionTable2 && (
            <div className="alert alert-info">
              <span className="text-sm">
                Table name: <strong>{watch("name")}</strong>
              </span>
            </div>
          )}
        </>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          {...register("description")}
          placeholder="Describe the purpose of this table"
        />
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start space-x-2">
          <input
            type="checkbox"
            className="checkbox"
            {...register("hideIdInCommand")}
          />
          <div className="tooltip" data-tip="Hide ID field from migration command">
            <span className="label-text">Hide ID in Command</span>
          </div>
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start space-x-2">
          <input
            type="checkbox"
            className="checkbox"
            {...register("withTimestamps")}
          />
          <div className="tooltip" data-tip="Adds created_at and updated_at fields">
            <span className="label-text">With Timestamp Behavior</span>
          </div>
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start space-x-2">
          <input
            type="checkbox"
            className="checkbox"
            {...register("withBlameable")}
          />
          <div className="tooltip" data-tip="Adds created_by and updated_by fields">
            <span className="label-text">With Blameable Behavior</span>
          </div>
        </label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" className="btn btn-ghost" onClick={onSubmit}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {tableId ? "Update" : "Add"} Table
        </button>
      </div>
    </form>
  );
};

export { NodeForm };
