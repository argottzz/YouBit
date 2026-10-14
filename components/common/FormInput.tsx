import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
}

const fieldClass =
  "w-full rounded-xl border border-line bg-secondary px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary";

function FieldShell({
  label,
  error,
  hint,
  children,
}: BaseProps & { children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default function FormInput(props: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const { label, error, hint, ...rest } = props;
  return (
    <FieldShell label={label} error={error} hint={hint}>
      <input {...rest} className={fieldClass} />
    </FieldShell>
  );
}

export function FormTextarea(
  props: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { label, error, hint, ...rest } = props;
  return (
    <FieldShell label={label} error={error} hint={hint}>
      <textarea {...rest} className={fieldClass} />
    </FieldShell>
  );
}

export function FormSelect(
  props: BaseProps & SelectHTMLAttributes<HTMLSelectElement>,
) {
  const { label, error, hint, ...rest } = props;
  return (
    <FieldShell label={label} error={error} hint={hint}>
      <select {...rest} className={fieldClass} />
    </FieldShell>
  );
}
