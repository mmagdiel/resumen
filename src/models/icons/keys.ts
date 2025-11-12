const base = ["key", "asterisk", "logo"];
const edit = ["edit", "trash", "copy"];
const db = ["database", "command", "fingerprint"];
const appearance = ["plus", "x", "sun", "moon"];

const Icons = [...db, ...edit, ...appearance, ...base] as const;
export type Icon = (typeof Icons)[number];
