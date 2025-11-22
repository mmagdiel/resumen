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
  id: string;                 // Unique identifier
  name: string;               // Table name
  position: Position;         // Canvas position
  description: string;        // Table description
  withTimestamps?: boolean;   // Auto-add created_at/updated_at timestamps
  withBlameable?: boolean;    // Auto-add created_by/updated_by fields
  hideIdInCommand?: boolean;  // Hide primary key fields in migration command (set to false to include primaryKey/bigPrimaryKey)
  attributes: Attribute[];    // Column definitions
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
  id?: string;                           // Optional unique identifier
  name: string;                          // Column name
  type: AttributeType;                   // Data type
  isNotNull?: boolean;                   // NOT NULL constraint
  isUnique?: boolean;                    // UNIQUE constraint
  isPrimaryKey?: boolean;                // PRIMARY KEY constraint
  isForeignKey?: boolean;                // FOREIGN KEY constraint
  isUnsigned?: boolean;                  // UNSIGNED constraint (for numeric types)
  referencesTable?: string;              // Referenced table for foreign keys
  referencesField?: string;              // Referenced field for foreign keys
  defaultValue?: string | number | null; // Default value
}
```

**Attribute Type Variants:**

- **LackAttrs** (Lackable): Basic types without extra parameters
  - Types: `text`, `date`, `boolean`, `json`
  - No additional properties required

- **CountAttrs** (Countable): Types that may require length specification
  - Types: `char`, `string`, `binary`, `tinyInteger`, `smallint`, `integer`, `bigInteger`, `primaryKey`, `bigPrimaryKey`
  - Additional property: `length?: number`

- **ScatterableAttrs** (Scatterable): Types that may require precision
  - Types: `datetime`, `time`, `timestamp`, `float`, `double`
  - Additional property: `precision?: number`

- **ScaleAttrs** (Scalable): Types that may require both precision and scale
  - Types: `decimal`, `money`
  - Additional properties: `precision?: number`, `scale?: number`

### State Examples

#### Example 1: Basic User Table with Timestamps
```json
{
  "name": "With User",
  "nodes": [
    {
      "id": "node-1",
      "name": "user",
      "position": {
        "x": 93.44731801186194,
        "y": 92.0282918557163
      },
      "description": "User accounts table",
      "withTimestamps": true,
      "withBlameable": false,
      "attributes": [
        {
          "id": "attr-1",
          "name": "id",
          "type": "primaryKey",
          "isNotNull": true,
          "length": 11,
          "isUnique": true,
          "isPrimaryKey": true,
          "isForeignKey": false,
          "defaultValue": ""
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
          "name": "password_hash",
          "type": "string",
          "isUnsigned": true,
          "length": 3,
          "isNotNull": true,
          "isUnique": false,
          "isPrimaryKey": false,
          "isForeignKey": false,
          "defaultValue": ""
        },
        {
          "id": "attr-5",
          "name": "status",
          "type": "tinyInteger",
          "defaultValue": "10",
          "isNotNull": true,
          "isUnique": false,
          "isPrimaryKey": false,
          "isForeignKey": false
        },
        {
          "id": "attr-6",
          "name": "password_reset_token",
          "type": "string",
          "isNotNull": false,
          "isUnique": true,
          "isPrimaryKey": false,
          "isForeignKey": false,
          "defaultValue": ""
        },
        {
          "id": "users-created_at",
          "name": "created_at",
          "type": "integer",
          "isNotNull": true,
          "isUnsigned": true,
          "isForeignKey": false
        },
        {
          "id": "users-updated_at",
          "name": "updated_at",
          "type": "integer",
          "isNotNull": true,
          "isUnsigned": true,
          "isForeignKey": false
        },
        {
          "name": "auth_key",
          "type": "string",
          "isNotNull": true,
          "isUnique": false,
          "isPrimaryKey": false,
          "isForeignKey": false,
          "defaultValue": "",
          "id": "node-1-auth_key"
        },
        {
          "name": "verification_token",
          "type": "string",
          "isNotNull": false,
          "isUnique": false,
          "isPrimaryKey": false,
          "isForeignKey": false,
          "defaultValue": "",
          "id": "node-1-verification_token"
        }
      ],
      "hideIdInCommand": true
    }
  ],
  "edges": []
}
```

#### Example 2: Blog System with Blameable Fields
```json
{
  "name": "Blog System",
  "nodes": [
    {
      "id": "node-1",
      "name": "users",
      "position": { "x": 100, "y": 100 },
      "description": "User accounts",
      "withTimestamps": true,
      "attributes": [
        {
          "id": "attr-1",
          "name": "id",
          "type": "bigPrimaryKey",
          "isNotNull": true
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
      "withTimestamps": true,
      "withBlameable": true,
      "hideIdInCommand": false,
      "attributes": [
        {
          "id": "attr-3",
          "name": "id",
          "type": "bigPrimaryKey",
          "isNotNull": true
        },
        {
          "id": "attr-4",
          "name": "user_id",
          "type": "bigInteger",
          "isNotNull": true,
          "isUnsigned": true,
          "isForeignKey": true,
          "referencesTable": "users",
          "referencesField": "id"
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
          "name": "view_count",
          "type": "integer",
          "isUnsigned": true,
          "defaultValue": 0
        },
        {
          "id": "attr-8",
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

#### Example 3: E-commerce Schema with Advanced Types
```json
{
  "name": "E-commerce Database",
  "nodes": [
    {
      "id": "node-1",
      "name": "products",
      "position": { "x": 100, "y": 100 },
      "description": "Product catalog",
      "withTimestamps": true,
      "attributes": [
        {
          "id": "attr-1",
          "name": "id",
          "type": "bigPrimaryKey",
          "isNotNull": true
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
          "name": "weight",
          "type": "double",
          "precision": 8
        },
        {
          "id": "attr-6",
          "name": "stock",
          "type": "integer",
          "isUnsigned": true,
          "defaultValue": 0
        },
        {
          "id": "attr-7",
          "name": "is_available",
          "type": "boolean",
          "defaultValue": true
        },
        {
          "id": "attr-8",
          "name": "metadata",
          "type": "json"
        }
      ]
    },
    {
      "id": "node-2",
      "name": "orders",
      "position": { "x": 450, "y": 100 },
      "description": "Customer orders",
      "withTimestamps": true,
      "withBlameable": true,
      "attributes": [
        {
          "id": "attr-9",
          "name": "id",
          "type": "bigPrimaryKey",
          "isNotNull": true
        },
        {
          "id": "attr-10",
          "name": "order_number",
          "type": "string",
          "isNotNull": true,
          "isUnique": true,
          "length": 20
        },
        {
          "id": "attr-11",
          "name": "total",
          "type": "money",
          "isNotNull": true,
          "precision": 19,
          "scale": 4
        },
        {
          "id": "attr-12",
          "name": "status",
          "type": "string",
          "isNotNull": true,
          "length": 20,
          "defaultValue": "pending"
        }
      ]
    },
    {
      "id": "node-3",
      "name": "order_items",
      "position": { "x": 275, "y": 300 },
      "description": "Order line items",
      "hideIdInCommand": true,
      "attributes": [
        {
          "id": "attr-13",
          "name": "order_id",
          "type": "bigInteger",
          "isNotNull": true,
          "isUnsigned": true,
          "isForeignKey": true,
          "referencesTable": "orders",
          "referencesField": "id"
        },
        {
          "id": "attr-14",
          "name": "product_id",
          "type": "bigInteger",
          "isNotNull": true,
          "isUnsigned": true,
          "isForeignKey": true,
          "referencesTable": "products",
          "referencesField": "id"
        },
        {
          "id": "attr-15",
          "name": "quantity",
          "type": "smallint",
          "isNotNull": true,
          "isUnsigned": true
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

#### Example 4: Scientific Data with All New Types
```json
{
  "name": "Scientific Research Database",
  "nodes": [
    {
      "id": "node-1",
      "name": "experiments",
      "position": { "x": 100, "y": 100 },
      "description": "Scientific experiments tracking",
      "withTimestamps": true,
      "withBlameable": true,
      "attributes": [
        {
          "name": "id",
          "type": "bigPrimaryKey"
        },
        {
          "name": "experiment_code",
          "type": "char",
          "isNotNull": true,
          "isUnique": true,
          "length": 10
        },
        {
          "name": "temperature",
          "type": "double",
          "precision": 10
        },
        {
          "name": "pressure",
          "type": "float",
          "precision": 6
        },
        {
          "name": "sample_count",
          "type": "tinyInteger",
          "isUnsigned": true,
          "defaultValue": 1
        },
        {
          "name": "cost",
          "type": "money",
          "precision": 12,
          "scale": 4
        },
        {
          "name": "start_date",
          "type": "date"
        },
        {
          "name": "start_time",
          "type": "time",
          "precision": 3
        },
        {
          "name": "is_completed",
          "type": "boolean",
          "defaultValue": false
        },
        {
          "name": "results",
          "type": "json"
        },
        {
          "name": "notes",
          "type": "text"
        },
        {
          "name": "data_hash",
          "type": "binary",
          "length": 32
        }
      ]
    }
  ],
  "edges": []
}
```

**This example demonstrates:**
- `bigPrimaryKey` for auto-increment primary key
- `char` for fixed-length codes
- `double` and `float` for high-precision measurements
- `tinyInteger` with `isUnsigned` for small positive values
- `money` type for currency with precision
- `date` and `time` types for temporal data
- `json` type for structured data
- `binary` type for hash storage
- `withTimestamps` and `withBlameable` flags
- Optional `id` field (automatically generated)

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
| `text` | Lackable | None | Long descriptions, comments |
| `date` | Lackable | None | Birth dates, event dates |
| `boolean` | Lackable | None | Active flags, status toggles |
| `json` | Lackable | None | JSON data, configuration objects |
| `char` | Countable | `length` | Fixed-size codes (e.g., country codes) |
| `string` | Countable | `length` | Names, emails, variable-length text |
| `binary` | Countable | `length` | Binary data, file hashes |
| `tinyInteger` | Countable | `length` | Very small numbers (0-255) |
| `smallint` | Countable | `length` | Small numbers (-32K to 32K) |
| `integer` | Countable | `length` | Standard IDs, counts |
| `bigInteger` | Countable | `length` | Large numbers, big IDs |
| `primaryKey` | Countable | `length` | Auto-increment primary key (integer) |
| `bigPrimaryKey` | Countable | `length` | Auto-increment primary key (bigInteger) |
| `datetime` | Scatterable | `precision` | Created/updated timestamps |
| `time` | Scatterable | `precision` | Time of day |
| `timestamp` | Scatterable | `precision` | Unix timestamps |
| `float` | Scatterable | `precision` | Approximate decimal numbers |
| `double` | Scatterable | `precision` | High-precision floating point |
| `decimal` | Scalable | `precision`, `scale` | Exact decimal numbers, prices |
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
