import { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem, Chip } from "@heroui/react";

interface MultiSelectAutocompleteProps {
  options: {
    label: string;
    key: string;
  }[];
  onChangeOptions: (keys: string[]) => void;
}

const MultiSelectAutocomplete = ({
  options,
  onChangeOptions,
}: MultiSelectAutocompleteProps) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const handleSelect = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleRemove = (key: string) => {
    setSelectedKeys((prev) => prev.filter((k) => k !== key));
  };

  useEffect(() => {
    onChangeOptions(selectedKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys]);

  return (
    <div className="max-w-md space-y-2 flex flex-col items-end">
      <Autocomplete
        placeholder="Select multiple options"
        className="w-80 seft-end"
        allowsCustomValue={false}
        defaultItems={options}
        onSelectionChange={(key) => {
          if (key) handleSelect(key as string);
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>

      <div className="flex flex-wrap gap-2 items-end justify-end">
        {selectedKeys.map((key) => {
          const item = options.find((o) => o.key === key);
          return (
            <Chip
              key={key}
              onClose={() => handleRemove(key)}
              color="default"
              size={"sm"}
              variant="flat"
            >
              {item?.label}
            </Chip>
          );
        })}
      </div>
    </div>
  );
};

export default MultiSelectAutocomplete;
