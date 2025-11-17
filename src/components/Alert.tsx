import type { AlertProps } from "@models/components";

import {Icon} from "./Icon"

export const Alert: AlertProps = ({ id, size, label }) => {
    const className = `alert alert-${id}`
    return <div className={className}>
        <Icon id={id} size={size} />
        <span>{label}</span>
    </div>
};
