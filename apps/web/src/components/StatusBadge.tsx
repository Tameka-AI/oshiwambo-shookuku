import { STATUS_LABEL, type Status } from "@shookuku/content";

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`status status--${status}`}>{STATUS_LABEL[status]}</span>;
}
