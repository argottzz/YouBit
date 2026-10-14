import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
}

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & { textarea?: false; select?: false };

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & { textarea: true };

type SelectProps = BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & { select: true };

type FormInputProps = InputProps | TextareaProps | SelectProps;

const fieldClass =
  "w-full rounded-xl border border-line bg-secondary px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary";

export default function FormInput(props: FormInputProps) {
  const { label, error, hint } = props;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {props.textarea ? (
        <textarea {...props} className={fieldClass} />
      ) : props.select ? (
        <select {...props} className={fieldClass} />
      ) : (
        <input {...props} className={fieldClass} />
      )}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
