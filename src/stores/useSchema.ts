import { create } from "zustand";

import type { UseSchema } from "@models/stores";
import type { Edge, Table, Attribute } from "@models/core/yii";

const initialSchema = {
  tables: [],
  edges: [],
};

export const useSchema = create<UseSchema>((set) => ({
  schema: initialSchema,

  addTable: (table) =>
    set((state) => {
      const attributes = [
        {
          id: `${table.name}-id`,
          name: "id",
          type: "integer",
          isRequired: true,
          isUnique: true,
          isPrimaryKey: true,
          isForeignKey: false,
        },
      ];
      const id = table.name.toLowerCase().replace(/\s+/g, "_");
      const newTable: Table = {
        ...table,
        id,
        attributes,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
      };

      return {
        schema: {
          ...state.schema,
          tables: [...state.schema.tables, newTable],
        },
      };
    }),

  updateTable: (id, data) =>
    set((state) => ({
      schema: {
        ...state.schema,
        tables: state.schema.tables.map((table) =>
          table.id === id ? { ...table, ...data } : table,
        ),
      },
    })),

  deleteTable: (id) =>
    set((state) => {
      // Remove edges connected to this table
      const filteredEdges = state.schema.edges.filter(
        (edge) => edge.source !== id && edge.target !== id,
      );

      return {
        schema: {
          tables: state.schema.tables.filter((table) => table.id !== id),
          edges: filteredEdges,
        },
      };
    }),

  updateTablePosition: (id, position) =>
    set((state) => ({
      schema: {
        ...state.schema,
        tables: state.schema.tables.map((table) =>
          table.id === id ? { ...table, position } : table,
        ),
      },
    })),

  addAttribute: (tableId, attribute) =>
    set((state) => {
      const newAttribute = {
        ...attribute,
        id: `${tableId}-${attribute.name}`,
      };

      // If this is a foreign key, create an edge
      const newEdges = [...state.schema.edges];
      if (attribute.isForeignKey && attribute.referencesTable) {
        const targetTable = state.schema.tables.find(
          (t) => t.id === attribute.referencesTable,
        );
        if (targetTable) {
          const targetAttribute =
            targetTable.attributes.find((a) => a.isPrimaryKey) ||
            targetTable.attributes[0];
          if (targetAttribute) {
            const newEdge: Edge = {
              id: `edge-${tableId}-${attribute.referencesTable}`,
              source: tableId,
              target: attribute.referencesTable,
              sourceHandle: newAttribute.id,
              targetHandle: targetAttribute.id,
              label: attribute.name.replace("_id", ""),
            };
            newEdges.push(newEdge);
          }
        }
      }

      return {
        schema: {
          ...state.schema,
          tables: state.schema.tables.map((table) =>
            table.id === tableId
              ? {
                  ...table,
                  attributes: [
                    ...table.attributes,
                    newAttribute,
                  ] as Attribute[],
                }
              : table,
          ),
          edges: newEdges,
        },
      };
    }),

  updateAttribute: (tableId, attributeId, data) =>
    set((state) => {
      // Handle updating edges if foreign key relationship changes
      let newEdges = [...state.schema.edges];

      // Find existing attribute
      const table = state.schema.tables.find((t) => t.id === tableId);
      const existingAttribute = table?.attributes.find(
        (a) => a.id === attributeId,
      );

      // Find existing edge for this attribute
      const existingEdgeIndex = state.schema.edges.findIndex(
        (e) => e.sourceHandle === attributeId,
      );

      // If foreign key status changed
      if (
        data.isForeignKey !== undefined ||
        data.referencesTable !== undefined
      ) {
        // If was a foreign key but no longer is, or reference table changed
        if (existingEdgeIndex !== -1) {
          // Remove existing edge
          newEdges = newEdges.filter((_, i) => i !== existingEdgeIndex);
        }

        // If is now a foreign key or reference table changed
        if (
          data.isForeignKey ||
          (existingAttribute?.isForeignKey && data.referencesTable)
        ) {
          const refTable =
            data.referencesTable || existingAttribute?.referencesTable;

          if (refTable) {
            const targetTable = state.schema.tables.find(
              (t) => t.id === refTable,
            );
            if (targetTable) {
              const targetAttribute =
                targetTable.attributes.find((a) => a.isPrimaryKey) ||
                targetTable.attributes[0];
              if (targetAttribute) {
                const newEdge: Edge = {
                  id: `edge-${tableId}-${refTable}`,
                  source: tableId,
                  target: refTable,
                  sourceHandle: attributeId,
                  targetHandle: targetAttribute.id,
                  label: (data.name || existingAttribute?.name || "").replace(
                    "_id",
                    "",
                  ),
                };
                newEdges.push(newEdge);
              }
            }
          }
        }
      }

      return {
        schema: {
          ...state.schema,
          tables: state.schema.tables.map((table) =>
            table.id === tableId
              ? {
                  ...table,
                  attributes: table.attributes.map((attr) =>
                    attr.id === attributeId ? { ...attr, ...data } : attr,
                  ) as Attribute[],
                }
              : table,
          ),
          edges: newEdges,
        },
      };
    }),

  deleteAttribute: (tableId, attributeId) =>
    set((state) => {
      // Remove any edges connected to this attribute
      const filteredEdges = state.schema.edges.filter(
        (edge) =>
          edge.sourceHandle !== attributeId &&
          edge.targetHandle !== attributeId,
      );

      return {
        schema: {
          ...state.schema,
          tables: state.schema.tables.map((table) =>
            table.id === tableId
              ? {
                  ...table,
                  attributes: table.attributes.filter(
                    (attr) => attr.id !== attributeId,
                  ),
                }
              : table,
          ),
          edges: filteredEdges,
        },
      };
    }),
}));
