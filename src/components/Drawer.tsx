import type { FC } from "react";

import { Icon } from "./Icon"
import { useLayout } from "../stores";
import { NodeForm, EdgeForm } from "./forms";

const Drawer: FC = () => {
  const { drawer, closeDrawer } = useLayout();
  const { isOpen, type, tableId, attributeId } = drawer;

  // Determine which form to render
  const renderForm = () => {
    if (!type) return null;

    if (attributeId && tableId) {
      return (
        <EdgeForm
          tableId={tableId}
          attributeId={attributeId}
          onSubmit={closeDrawer}
        />
      );
    }

    if (type === "create" && tableId) {
      return <EdgeForm tableId={tableId} onSubmit={closeDrawer} />;
    }

    return (
      <NodeForm
        tableId={type === "edit" ? tableId || undefined : undefined}
        onSubmit={closeDrawer}
      />
    );
  };

  return (
    <div className={`drawer drawer-end ${isOpen ? "drawer-open" : ""}`}>
      <input
        id="drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        readOnly
      />

      {/* Drawer background overlay */}
      <div className="drawer-side z-30">
        <label
          htmlFor="drawer"
          className="drawer-overlay"
          onClick={closeDrawer}
        ></label>

        {/* Drawer content */}
        <div className="p-4 min-h-full bg-base-100 w-80 md:w-96 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {type === "create"
                ? attributeId
                  ? "Add Attribute"
                  : tableId
                  ? "Add Attribute"
                  : "Add Table"
                : attributeId
                ? "Edit Attribute"
                : "Edit Table"}
            </h2>
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={closeDrawer}
              aria-label="Close drawer"
            >
              <Icon id="x" size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">{renderForm()}</div>
        </div>
      </div>
    </div>
  );
};

export { Drawer };
