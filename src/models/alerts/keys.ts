const Alerts = ["error", "info", "success"] as const;
export type Alert = (typeof Alerts)[number];
