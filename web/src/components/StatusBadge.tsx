import { STATUS_LABEL } from "../format";
import type { Status } from "../types";

export default function StatusBadge({ status }: { status: Status }) {
  return <span className={`badge badge-${status}`}>{STATUS_LABEL[status]}</span>;
}
