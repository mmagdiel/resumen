# Yii Database Migration Designer

A visual tool for designing and managing Yii Framework database migrations using an interactive node-based interface.

## Overview

This application allows you to visually design database schemas by creating tables (nodes), relationships (edges), and attributes. The state can be persisted to local storage for seamless editing across sessions.

## State Structure

The application state is stored as a `Database` object that contains nodes and edges. This structure can be serialized to JSON and saved to local storage.

### Core Types

#### Database
The main container for your diagram schema, including a name for identification.
```typescript
interface Database {
  name: string;        // Diagram name for identification
  nodes: Node[];       // Array of table nodes
  edges: Edge[];       // Array of relationships
}
```

#### Node
Represents a database table with its attributes and position on the canvas.
```typescript
interface Node {
  id: string;              // Unique identifier
  name: string;            // Table name
  position: Position;      // Canvas position
  description: string;     // Table description
  attributes: Attribute[]; // Column definitions
}

interface Position {
  x: number;
  y: number;
}
```

#### Edge
Represents a relationship between two tables.
```typescript
interface Edge {
  id: string;            // Unique identifier
  source: string;        // Source node ID
  target: string;        // Target node ID
  label?: string;        // Optional relationship label
  sourceHandle?: string; // Connection point on source
  targetHandle?: string; // Connection point on target
}
```

#### Attribute
Represents a table column. Attributes have different types based on their data requirements:

**Base Attribute Properties:**
```typescript
interface AttrDTO {
  id: string;
  name: string;
  type: AttributeType;
  isNotNull?: boolean;
  isUnique?: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  referencesTable?: string;
  referencesField?: string;
  defaultValue?: string | number | null;
}
```

**Attribute Type Variants:**

- **FlatAttrs**: Basic types without extra parameters
  - Types: `text`, `date`, `boolean`

- **CountAttrs**: Types that require length specification
  - Types: `char`, `string`, `smallint`, `integer`, `bigint`, `binary`
  - Additional property: `length: number`

- **AccuracyAttrs**: Types that require precision
  - Types: `datetime`, `time`, `timestamp`, `float`
  - Additional property: `precision: number`

- **ScaleAttrs**: Types that require both precision and scale
  - Types: `decimal`, `money`
  - Additional properties: `precision: number`, `scale: number`

### State Examples

#### Example 1: Basic User Table
```json
{
  "name": "User Management",
  "nodes": [
    {
      "id": "node-1",
      "name": "users",
      "position": { "x": 100, "y": 100 },
      "description": "User accounts table",
      "attributes": [
        {
          "id": "attr-1",
          "name": "id",
          "type": "integer",
          "isPrimaryKey": true,
          "isNotNull": true,
          "length": 11
        },
        {
          "id": "attr-2",
          "name": "username",
          "type": "string",
          "isNotNull": true,
          "isUnique": true,
          "length": 50
        },
        {
          "id": "attr-3",
          "name": "email",
          "type": "string",
          "isNotNull": true,
          "isUnique": true,
          "length": 100
        },
        {
          "id": "attr-4",
          "name": "is_active",
          "type": "boolean",
          "defaultValue": true
        },
        {
          "id": "attr-5",
          "name": "created_at",
          "type": "datetime",
          "isNotNull": true,
          "precision": 0
        }
      ]
    }
  ],
  "edges": []
}
```

#### Example 2: User-Posts Relationship
```json
{
  "name": "Blog System",
  "nodes": [
    {
      "id": "node-1",
      "name": "users",
      "position": { "x": 100, "y": 100 },
      "description": "User accounts",
      "attributes": [
        {
          "id": "attr-1",
          "name": "id",
          "type": "integer",
          "isPrimaryKey": true,
          "isNotNull": true,
          "length": 11
        },
        {
          "id": "attr-2",
          "name": "username",
          "type": "string",
          "isNotNull": true,
          "length": 50
        }
      ]
    },
    {
      "id": "node-2",
      "name": "posts",
      "position": { "x": 400, "y": 100 },
      "description": "User posts",
      "attributes": [
        {
          "id": "attr-3",
          "name": "id",
          "type": "integer",
          "isPrimaryKey": true,
          "isNotNull": true,
          "length": 11
        },
        {
          "id": "attr-4",
          "name": "user_id",
          "type": "integer",
          "isNotNull": true,
          "isForeignKey": true,
          "referencesTable": "users",
          "referencesField": "id",
          "length": 11
        },
        {
          "id": "attr-5",
          "name": "title",
          "type": "string",
          "isNotNull": true,
          "length": 200
        },
        {
          "id": "attr-6",
          "name": "content",
          "type": "text"
        },
        {
          "id": "attr-7",
          "name": "published_at",
          "type": "timestamp",
          "precision": 0
        }
      ]
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "label": "has many",
      "sourceHandle": "right",
      "targetHandle": "left"
    }
  ]
}
```

#### Example 3: E-commerce Schema
```json
{
  "name": "E-commerce Database",
  "nodes": [
    {
      "id": "node-1",
      "name": "products",
      "position": { "x": 100, "y": 100 },
      "description": "Product catalog",
      "attributes": [
        {
          "id": "attr-1",
          "name": "id",
          "type": "integer",
          "isPrimaryKey": true,
          "isNotNull": true,
          "length": 11
        },
        {
          "id": "attr-2",
          "name": "sku",
          "type": "string",
          "isNotNull": true,
          "isUnique": true,
          "length": 50
        },
        {
          "id": "attr-3",
          "name": "name",
          "type": "string",
          "isNotNull": true,
          "length": 255
        },
        {
          "id": "attr-4",
          "name": "price",
          "type": "decimal",
          "isNotNull": true,
          "precision": 10,
          "scale": 2
        },
        {
          "id": "attr-5",
          "name": "stock",
          "type": "integer",
          "defaultValue": 0,
          "length": 11
        },
        {
          "id": "attr-6",
          "name": "is_available",
          "type": "boolean",
          "defaultValue": true
        }
      ]
    },
    {
      "id": "node-2",
      "name": "orders",
      "position": { "x": 450, "y": 100 },
      "description": "Customer orders",
      "attributes": [
        {
          "id": "attr-7",
          "name": "id",
          "type": "integer",
          "isPrimaryKey": true,
          "isNotNull": true,
          "length": 11
        },
        {
          "id": "attr-8",
          "name": "order_number",
          "type": "string",
          "isNotNull": true,
          "isUnique": true,
          "length": 20
        },
        {
          "id": "attr-9",
          "name": "total",
          "type": "money",
          "isNotNull": true,
          "precision": 19,
          "scale": 4
        },
        {
          "id": "attr-10",
          "name": "status",
          "type": "string",
          "isNotNull": true,
          "length": 20,
          "defaultValue": "pending"
        },
        {
          "id": "attr-11",
          "name": "created_at",
          "type": "datetime",
          "isNotNull": true,
          "precision": 0
        }
      ]
    },
    {
      "id": "node-3",
      "name": "order_items",
      "position": { "x": 275, "y": 300 },
      "description": "Order line items",
      "attributes": [
        {
          "id": "attr-12",
          "name": "id",
          "type": "integer",
          "isPrimaryKey": true,
          "isNotNull": true,
          "length": 11
        },
        {
          "id": "attr-13",
          "name": "order_id",
          "type": "integer",
          "isNotNull": true,
          "isForeignKey": true,
          "referencesTable": "orders",
          "referencesField": "id",
          "length": 11
        },
        {
          "id": "attr-14",
          "name": "product_id",
          "type": "integer",
          "isNotNull": true,
          "isForeignKey": true,
          "referencesTable": "products",
          "referencesField": "id",
          "length": 11
        },
        {
          "id": "attr-15",
          "name": "quantity",
          "type": "integer",
          "isNotNull": true,
          "length": 11
        },
        {
          "id": "attr-16",
          "name": "unit_price",
          "type": "decimal",
          "isNotNull": true,
          "precision": 10,
          "scale": 2
        }
      ]
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-2",
      "target": "node-3",
      "label": "has many",
      "sourceHandle": "bottom",
      "targetHandle": "top"
    },
    {
      "id": "edge-2",
      "source": "node-1",
      "target": "node-3",
      "label": "belongs to",
      "sourceHandle": "bottom",
      "targetHandle": "top"
    }
  ]
}
```

### Local Storage Implementation

The application uses **Zustand's persist middleware** to automatically save and restore state from local storage. The state is stored under the key `yii-migration-schema`.

#### Store Configuration

The store is configured with automatic persistence:

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSchema = create<UseSchema>()(
  persist(
    (set) => ({
      schema: {
        name: "Untitled Diagram",
        nodes: [],
        edges: [],
      },
      setDiagramName: (name) => set((state) => ({
        schema: { ...state.schema, name }
      })),
      // ... other actions
    }),
    {
      name: "yii-migration-schema",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
```

#### Usage in Components

```typescript
import { useSchema } from "@stores/useSchema";

function DiagramHeader() {
  const { schema, setDiagramName } = useSchema();

  return (
    <input
      type="text"
      value={schema.name}
      onChange={(e) => setDiagramName(e.target.value)}
      placeholder="Diagram name"
    />
  );
}

// Access nodes and edges
function DiagramCanvas() {
  const { schema } = useSchema();
  const { name, nodes, edges } = schema;

  return (
    <div>
      <h2>{name}</h2>
      {/* Render your diagram */}
    </div>
  );
}
```

#### Manual State Operations

If you need to manually save/load state (for import/export features):

```typescript
// Export current state
const exportState = () => {
  const { schema } = useSchema.getState();
  const json = JSON.stringify(schema, null, 2);
  // Download as file or copy to clipboard
  return json;
};

// Import state from JSON
const importState = (jsonString: string) => {
  const imported: Database = JSON.parse(jsonString);
  // You would need to add a setState method to your store
  useSchema.setState({ schema: imported });
};

// Clear all data
const clearState = () => {
  localStorage.removeItem('yii-migration-schema');
  window.location.reload(); // Reload to reset to initial state
};
```

### Attribute Type Reference

| Type | Category | Additional Properties | Example Use Case |
|------|----------|----------------------|------------------|
| `text` | Flat | None | Long descriptions |
| `date` | Flat | None | Birth dates |
| `boolean` | Flat | None | Active flags |
| `char` | Countable | `length` | Fixed-size codes |
| `string` | Countable | `length` | Names, emails |
| `smallint` | Countable | `length` | Small numbers |
| `integer` | Countable | `length` | IDs, counts |
| `bigint` | Countable | `length` | Large numbers |
| `binary` | Countable | `length` | Binary data |
| `datetime` | Accuracy | `precision` | Created timestamps |
| `time` | Accuracy | `precision` | Time of day |
| `timestamp` | Accuracy | `precision` | Unix timestamps |
| `float` | Accuracy | `precision` | Measurements |
| `decimal` | Scalable | `precision`, `scale` | Prices |
| `money` | Scalable | `precision`, `scale` | Currency values |

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
