import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { UseSchema } from "@models/stores";
import type { Edge, Node, Attribute, Attributes } from "@models/core/yii";

const initialSchema = {
  name: "Untitled Diagram",
  nodes: [],
  edges: [],
};

// Node nodes
export const useSchema = create<UseSchema>()(
  persist(
    (set) => ({
      schema: initialSchema,

      setDiagramName: (name) =>
        set((state) => ({
          schema: {
            ...state.schema,
            name,
          },
        })),

      loadDiagram: (diagram) =>
        set(() => ({
          schema: diagram,
        })),

      addNode: (node) =>
        set((state) => {
          const attributes = [] as Attributes;

          // Only add ID primary key for non-junction tables
          if (!node.isJunction) {
            attributes.push({
              id: `${node.name}-id`,
              name: "id",
              type: "integer",
              sort: 0,
              isNotNull: true,
              isUnique: true,
              isPrimaryKey: true,
              isForeignKey: false,
            });
          }

          // For junction tables, add foreign key attributes
          if (node.isJunction && node.junctionTable1 && node.junctionTable2) {
            const table1 = state.schema.nodes.find((t) => t.id === node.junctionTable1);
            const table2 = state.schema.nodes.find((t) => t.id === node.junctionTable2);

            if (table1) {
              attributes.push({
                id: `${node.name}-${table1.name}_id`,
                name: `${table1.name}_id`,
                type: "integer",
                sort: attributes.length,
                isNotNull: true,
                isUnsigned: true,
                isForeignKey: true,
                referencesTable: table1.id,
                referencesField: "id",
              });
            }

            if (table2) {
              attributes.push({
                id: `${node.name}-${table2.name}_id`,
                name: `${table2.name}_id`,
                type: "integer",
                sort: attributes.length,
                isNotNull: true,
                isUnsigned: true,
                isForeignKey: true,
                referencesTable: table2.id,
                referencesField: "id",
              });
            }
          }

          // Add timestamp fields if enabled
          if (node.withTimestamps) {
            attributes.push({
              id: `${node.name}-created_at`,
              name: "created_at",
              type: "integer",
              sort: attributes.length,
              isNotNull: true,
              isUnsigned: true,
              isForeignKey: false,
            });
            attributes.push({
              id: `${node.name}-updated_at`,
              name: "updated_at",
              type: "integer",
              sort: attributes.length,
              isNotNull: true,
              isUnsigned: true,
              isForeignKey: false,
            });
          }

          // Add blameable fields if enabled
          if (node.withBlameable) {
            attributes.push({
              id: `${node.name}-created_by`,
              name: "created_by",
              type: "integer",
              sort: attributes.length,
              isNotNull: true,
              isUnsigned: true,
              isForeignKey: false,
            });
            attributes.push({
              id: `${node.name}-updated_by`,
              name: "updated_by",
              type: "integer",
              sort: attributes.length,
              isNotNull: true,
              isUnsigned: true,
              isForeignKey: false,
            });
          }

          const id = node.name.toLowerCase().replace(/\s+/g, "_");
          const newNode: Node = {
            ...node,
            id,
            attributes,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
          };

          // Create edges for junction tables
          const newEdges = [...state.schema.edges];
          if (node.isJunction && node.junctionTable1 && node.junctionTable2) {
            const table1 = state.schema.nodes.find((t) => t.id === node.junctionTable1);
            const table2 = state.schema.nodes.find((t) => t.id === node.junctionTable2);

            // Create edge to first table
            if (table1) {
              const table1PrimaryKey = table1.attributes.find((a) => a.isPrimaryKey);
              const junctionTable1FK = attributes.find(
                (a) => a.name === `${table1.name}_id`
              );
              if (table1PrimaryKey && junctionTable1FK) {
                newEdges.push({
                  id: `edge-${id}-${table1.id}`,
                  source: id,
                  target: table1.id,
                  sourceHandle: junctionTable1FK.id,
                  targetHandle: table1PrimaryKey.id,
                  label: table1.name,
                });
              }
            }

            // Create edge to second table
            if (table2) {
              const table2PrimaryKey = table2.attributes.find((a) => a.isPrimaryKey);
              const junctionTable2FK = attributes.find(
                (a) => a.name === `${table2.name}_id`
              );
              if (table2PrimaryKey && junctionTable2FK) {
                newEdges.push({
                  id: `edge-${id}-${table2.id}`,
                  source: id,
                  target: table2.id,
                  sourceHandle: junctionTable2FK.id,
                  targetHandle: table2PrimaryKey.id,
                  label: table2.name,
                });
              }
            }
          }

          return {
            schema: {
              ...state.schema,
              nodes: [...state.schema.nodes, newNode],
              edges: newEdges,
            },
          };
        }),

      updateNode: (id, data) =>
        set((state) => {
          const table = state.schema.nodes.find((t) => t.id === id);
          if (!table) return state;

          let updatedAttributes = [...table.attributes];

          // Handle timestamp behavior changes
          if (
            data.withTimestamps !== undefined &&
            data.withTimestamps !== table.withTimestamps
          ) {
            if (data.withTimestamps) {
              // Add timestamp fields if not already present
              const hasCreatedAt = updatedAttributes.some(
                (attr) => attr.name === "created_at",
              );
              const hasUpdatedAt = updatedAttributes.some(
                (attr) => attr.name === "updated_at",
              );

              if (!hasCreatedAt) {
                updatedAttributes.push({
                  id: `${table.name}-created_at`,
                  name: "created_at",
                  type: "integer",
                  sort: updatedAttributes.length,
                  isNotNull: true,
                  isUnsigned: true,
                  isForeignKey: false,
                });
              }
              if (!hasUpdatedAt) {
                updatedAttributes.push({
                  id: `${table.name}-updated_at`,
                  name: "updated_at",
                  type: "integer",
                  sort: updatedAttributes.length,
                  isNotNull: true,
                  isUnsigned: true,
                  isForeignKey: false,
                });
              }
            } else {
              // Remove timestamp fields
              updatedAttributes = updatedAttributes.filter(
                (attr) =>
                  attr.name !== "created_at" && attr.name !== "updated_at",
              );
            }
          }

          // Handle blameable behavior changes
          if (
            data.withBlameable !== undefined &&
            data.withBlameable !== table.withBlameable
          ) {
            if (data.withBlameable) {
              // Add blameable fields if not already present
              const hasCreatedBy = updatedAttributes.some(
                (attr) => attr.name === "created_by",
              );
              const hasUpdatedBy = updatedAttributes.some(
                (attr) => attr.name === "updated_by",
              );

              if (!hasCreatedBy) {
                updatedAttributes.push({
                  id: `${table.name}-created_by`,
                  name: "created_by",
                  type: "integer",
                  sort: updatedAttributes.length,
                  isNotNull: true,
                  isUnsigned: true,
                  isForeignKey: false,
                });
              }
              if (!hasUpdatedBy) {
                updatedAttributes.push({
                  id: `${table.name}-updated_by`,
                  name: "updated_by",
                  type: "integer",
                  sort: updatedAttributes.length,
                  isNotNull: true,
                  isUnsigned: true,
                  isForeignKey: false,
                });
              }
            } else {
              // Remove blameable fields
              updatedAttributes = updatedAttributes.filter(
                (attr) =>
                  attr.name !== "created_by" && attr.name !== "updated_by",
              );
            }
          }

          return {
            schema: {
              ...state.schema,
              nodes: state.schema.nodes.map((node) =>
                node.id === id
                  ? { ...node, ...data, attributes: updatedAttributes }
                  : node,
              ),
            },
          };
        }),

      deleteNode: (id) =>
        set((state) => {
          // Remove edges connected to this table
          const filteredEdges = state.schema.edges.filter(
            (edge) => edge.source !== id && edge.target !== id,
          );

          return {
            schema: {
              ...state.schema,
              nodes: state.schema.nodes.filter((node) => node.id !== id),
              edges: filteredEdges,
            },
          };
        }),

      updateNodePosition: (id, position) =>
        set((state) => ({
          schema: {
            ...state.schema,
            nodes: state.schema.nodes.map((node) =>
              node.id === id ? { ...node, position } : node,
            ),
          },
        })),

      addAttribute: (tableId, attribute) =>
        set((state) => {
          const table = state.schema.nodes.find((t) => t.id === tableId);
          const maxSort = table?.attributes.reduce(
            (max, attr) => Math.max(max, attr.sort ?? 0),
            -1
          ) ?? -1;

          const newAttribute = {
            ...attribute,
            id: `${tableId}-${attribute.name}`,
            sort: attribute.sort ?? maxSort + 1,
          };

          // If this is a foreign key, create an edge
          const newEdges = [...state.schema.edges];
          if (attribute.isForeignKey && attribute.referencesTable) {
            const targetTable = state.schema.nodes.find(
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
              nodes: state.schema.nodes.map((node) =>
                node.id === tableId
                  ? {
                      ...node,
                      attributes: [
                        ...node.attributes,
                        newAttribute,
                      ] as Attribute[],
                    }
                  : node,
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
          const table = state.schema.nodes.find((t) => t.id === tableId);
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
                const targetTable = state.schema.nodes.find(
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
                      label: (
                        data.name ||
                        existingAttribute?.name ||
                        ""
                      ).replace("_id", ""),
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
              nodes: state.schema.nodes.map((node) =>
                node.id === tableId
                  ? {
                      ...node,
                      attributes: node.attributes.map((attr) =>
                        attr.id === attributeId ? { ...attr, ...data } : attr,
                      ) as Attribute[],
                    }
                  : node,
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
              nodes: state.schema.nodes.map((node) =>
                node.id === tableId
                  ? {
                      ...node,
                      attributes: node.attributes.filter(
                        (attr) => attr.id !== attributeId,
                      ),
                    }
                  : node,
              ),
              edges: filteredEdges,
            },
          };
        }),

      reorderAttribute: (tableId, attributeId, direction) =>
        set((state) => {
          const table = state.schema.nodes.find((t) => t.id === tableId);
          if (!table) return state;

          // Sort attributes by current sort value
          const sortedAttrs = [...table.attributes].sort(
            (a, b) => (a.sort ?? 0) - (b.sort ?? 0)
          );

          // Find the index of the attribute to move
          const currentIndex = sortedAttrs.findIndex(
            (attr) => attr.id === attributeId
          );
          if (currentIndex === -1) return state;

          // Calculate the swap index
          const swapIndex =
            direction === "up" ? currentIndex - 1 : currentIndex + 1;

          // Check if the swap is valid
          if (swapIndex < 0 || swapIndex >= sortedAttrs.length) return state;

          // Swap the sort values
          const currentSort = sortedAttrs[currentIndex].sort ?? currentIndex;
          const swapSort = sortedAttrs[swapIndex].sort ?? swapIndex;

          return {
            schema: {
              ...state.schema,
              nodes: state.schema.nodes.map((node) =>
                node.id === tableId
                  ? {
                      ...node,
                      attributes: node.attributes.map((attr) => {
                        if (attr.id === attributeId) {
                          return { ...attr, sort: swapSort };
                        }
                        if (attr.id === sortedAttrs[swapIndex].id) {
                          return { ...attr, sort: currentSort };
                        }
                        return attr;
                      }) as Attribute[],
                    }
                  : node,
              ),
            },
          };
        }),
    }),
    {
      name: "yii-migration-schema",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
