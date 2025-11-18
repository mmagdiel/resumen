import type { FC } from "react";
import type { NodeProps } from "reactflow";
import type { Node, Attribute } from "../../models";

import { memo } from "react";
import { Icon } from "../Icon";
import { Handle, Position } from "reactflow";
import { useSchema, useLayout } from "../../stores";
import { migrationCmdYiiGenerate } from "../../services";

type TableNodeProps = NodeProps<Node>;

const TableNode: FC<TableNodeProps> = memo(({ data, id }) => {
  const { deleteNode } = useSchema();
  const { openDrawer } = useLayout();

  const handleEditTable = () => {
    openDrawer("edit", id);
  };

  const handleDeleteTable = () => {
    deleteNode(id);
  };

  const handleAddAttribute = () => {
    openDrawer("create", id);
  };

  const handleEditAttribute = (attributeId: string) => {
    openDrawer("edit", id, attributeId);
  };

  const handleCopyCommand = () => {
    const { name, attributes, hideIdInCommand } = data;
    const command = migrationCmdYiiGenerate(name, attributes, hideIdInCommand ?? true);
    navigator.clipboard.writeText(command);

    // Show toast or some indicator
    const toast = document.getElementById("command-toast");
    if (toast) {
      toast.classList.remove("hidden");
      setTimeout(() => {
        toast.classList.add("hidden");
      }, 3000);
    }
  };

  const attrs = [...data.attributes]
  const size = attrs.sort((a,b) => {
    if(a.name.length < b.name.length) return 1;
    if(a.name.length > b.name.length) return -1;
    return 0;
  })[0].name.length

  const clazz = `bg-base-100 rounded-lg shadow-lg p-4 border border-base-300 w-${size < 19 ? 64 : (size > 19? 80: 96)}`
  return (
    <div className={clazz}>
      {/* Table Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <Icon id="database" size={16} className="text-primary" />
          <h3 className="font-bold text-lg">{data.name}</h3>
        </div>
        <div className="flex space-x-1">
          <button
            className="btn btn-xs btn-ghost"
            onClick={handleEditTable}
            aria-label="Edit table"
          >
            <Icon id="edit" size={14} className="text-primary" />
          </button>
          <button
            className="btn btn-xs btn-ghost text-error"
            onClick={handleDeleteTable}
            aria-label="Delete table"
          >
            <Icon id="trash" size={14} />
          </button>
        </div>
      </div>

      {/* Description */}
      {data.description && (
        <p className="text-xs text-base-content/70 mb-1">{data.description}</p>
      )}

      {/* Table Attributes */}
      <div className="divide-y divide-base-300">
        {data.attributes.map((attr: Attribute) => (
          <div key={attr.id} className="py-1.5 flex justify-between group">
            <div className="space-x-2">
              <span className="font-medium text-sm">{attr.name}</span>
              <span className="text-xs text-base-content/70">{attr.type}</span>
            </div>
            <div className="space-x-2">
              {attr.isPrimaryKey && (
                <div className="tooltip" data-tip="Primary Key">
                  <Icon id="key" className="inline text-primary" size={14} />
                </div>
              )}
              {attr.isForeignKey && (
                <div className="tooltip" data-tip="Foreign Key">
                  <Icon id="key" className="inline text-secondary" size={14} />
                </div>
              )}
              {attr.isUnique && (
                <div className="tooltip" data-tip="Unique">
                  <Icon
                    size={14}
                    id="fingerprint"
                    className="inline text-secondary"
                  />
                </div>
              )}
              {attr.isNotNull && (
                <div className="tooltip" data-tip="Not Null">
                  <Icon
                    size={14}
                    id="asterisk"
                    className="inline text-primary"
                  />
                </div>
              )}
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => handleEditAttribute(attr?.id ?? "")}
                aria-label={`Edit ${attr.name} attribute`}
              >
                <Icon id="edit" size={12} />
              </button>
            </div>

            {/* Handle for creating connections */}
            {attr.isPrimaryKey && (
              <Handle
                type="target"
                position={Position.Left}
                id={attr.id}
                className="w-3 h-3 bg-primary border-2 border-base-100"
              />
            )}

            {attr.isForeignKey && (
              <Handle
                type="source"
                position={Position.Right}
                id={attr.id}
                className="w-3 h-3 bg-secondary border-2 border-base-100"
              />
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-2 flex justify-between">
        <button
          className="btn btn-xs btn-accent text-white mr-2"
          onClick={handleAddAttribute}
        >
          <Icon id="plus" size={14} />
          Attribute
        </button>

        <button
          className="btn btn-xs btn-outline btn-primary ml-2" 
          onClick={handleCopyCommand}
        >
          <Icon id="copy" size={14} />
          Command
        </button>
      </div>
    </div>
  );
});

export { TableNode };
