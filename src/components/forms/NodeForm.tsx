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
    formState: { errors },
  } = useForm<NodeFormValues>({
    defaultValues: table
      ? {
          name: table.name,
          description: table.description,
          withTimestamps: table.withTimestamps || false,
          withBlameable: table.withBlameable || false,
        }
      : {
          name: "",
          description: "",
          withTimestamps: false,
          withBlameable: false,
        },
  });

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
          disabled={!!tableId} // Don't allow changing table name when editing
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.name.message}
            </span>
          </label>
        )}
      </div>

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
