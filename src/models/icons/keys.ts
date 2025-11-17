const base = ["key", "asterisk", "logo", "eye", "error"];
const edit = ["edit", "trash", "copy", "plus", "check"];
const db = ["database", "command", "fingerprint", "download"];
const appearance = ["info", "x", "sun", "moon", "success"];

const Icons = [...db, ...edit, ...appearance, ...base] as const;
export type Icon = (typeof Icons)[number];
