export default function CategoryFilter({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
}) {
  const chips = ["Semua", ...categories];
  const active = value || "Semua";

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {chips.map((chip) => {
        const isActive = active === chip;
        return (
          <button
            key={chip}
            onClick={() => onChange(chip === "Semua" ? "" : chip)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-primary text-base"
                : "bg-secondary text-muted hover:text-ink"
            }`}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}
