import type { StatProps } from "@models/components";


const Stats:StatProps = ({name, nodes, edges}) => {
    return <div className="stats shadow w-full">
        <div className="stat">
            <div className="stat-title">Diagram Name</div>
            <div className="stat-value text-2xl">{name}</div>
        </div>
        <div className="stat">
            <div className="stat-title">Tables</div>
            <div className="stat-value text-2xl">{nodes}</div>
        </div>
        <div className="stat">
            <div className="stat-title">Relationships</div>
            <div className="stat-value text-2xl">{edges}</div>
        </div>
    </div>
}

export { Stats }