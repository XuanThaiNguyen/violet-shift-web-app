"use client";
import * as React from "react";
import { XCircle, ChevronDown, XIcon } from "lucide-react";
import {
  cn,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  type PopoverProps,
  Chip,
  Checkbox,
} from "@heroui/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/command/Command";
import { useControlledState } from "@/hooks/useControlledState";
import { useId } from "react";

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps extends Omit<PopoverProps, "children"> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: React.ReactNode;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
    disable?: boolean;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange?: (value: string[]) => void;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];
  /** The selected values when the component is controlled. */
  value?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  isDismissable?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;
  popoverClass?: string;
  showall?: boolean;
  label?: string;
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      defaultValue = [],
      value,
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      isDismissable = true,
      className,
      popoverClass,
      showall = false,
      label,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = useControlledState<string[]>({
      defaultValue,
      value,
      onChange: onValueChange,
      undefinedSync: false,
    });
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const _id = useId();
    const id = props.id || _id;

    const toggleOption = (option: string) => {
      if (!selectedValues) return;
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange?.(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange?.([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange?.(newSelectedValues);
    };
    const filteredOptions = options.filter((option) => !option.disable);
    const toggleAll = () => {
      if (selectedValues?.length === filteredOptions?.length) {
        handleClear();
      } else {
        const allValues = filteredOptions.map((option) => option.value);
        setSelectedValues(allValues || []);
        onValueChange?.(allValues);
      }
    };

    const selectedShow =
      showall || selectedValues.length <= maxCount + 1
        ? selectedValues
        : selectedValues.slice(0, maxCount);

    return (
      <Popover
        ref={ref}
        isOpen={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        isDismissable={isDismissable}
        placement="bottom-start"
        {...props}
      >
        <PopoverTrigger>
          <Button
            id={id}
            disableRipple
            as="button"
            onPress={handleTogglePopover}
            className={cn(
              "flex flex-col w-full py-2 px-3 rounded-xl border min-h-10 h-auto items-start justify-center",
              "bg-default-100 hover:bg-default-200 gap-1",
              "border-none !scale-none group",
              className
            )}
          >
            {label && (
              <label htmlFor={id} className="text-xs text-foreground">
                {label}
              </label>
            )}
            <div className="flex justify-between items-center w-full flex-1 h-full">
              {selectedValues.length > 0 ? (
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-wrap items-center gap-1 p-1">
                    {selectedShow.map((value) => {
                      const option = options.find((o) => o.value === value);
                      const IconComponent = option?.icon;
                      return (
                        <Chip
                          key={value}
                          color="primary"
                          variant="flat"
                          startContent={
                            IconComponent && (
                              <IconComponent className="h-4 w-4 mr-2" />
                            )
                          }
                          endContent={
                            <XCircle
                              className="ml-2 h-4 w-4 cursor-pointer"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleOption(value);
                              }}
                            />
                          }
                          className="flex items-center gap-2"
                        >
                          {option?.label}
                        </Chip>
                      );
                    })}
                    {!showall && selectedValues.length > maxCount + 1 && (
                      <div
                        className={cn(
                          "bg-primary-foreground inline-flex items-center border px-2 py-0.5 rounded-lg text-foreground border-foreground/1 hover:bg-transparent"
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {`+ ${selectedValues.length - maxCount} more`}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            clearExtraOptions();
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-default-foreground gap-3">
                    <XIcon
                      strokeWidth={1}
                      className="h-4 cursor-pointer"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleClear();
                      }}
                      size={16}
                    />
                    <ChevronDown
                      size={16}
                      strokeWidth={1.5}
                      data-open={isPopoverOpen}
                      className="cursor-pointer data-[open=true]:rotate-180 transition-transform duration-200"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full mx-auto gap-3">
                  <span className="text-sm text-foreground-500">
                    {placeholder}
                  </span>
                  <ChevronDown
                    data-open={isPopoverOpen}
                    strokeWidth={1.5}
                    className="h-4 cursor-pointer text-foreground-500 data-[open=true]:rotate-180 transition-transform duration-200"
                  />
                </div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0 min-w-full", popoverClass)}>
          <Command>
            <CommandInput
              classNames={{ wrapper: "border-divider h-10" }}
              placeholder="Search..."
            />
            <CommandList className="hidden-scrollbar">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  className="cursor-pointer py-2 hover:bg-default-100"
                >
                  <Checkbox
                    isIndeterminate={
                      selectedValues.length > 0 &&
                      selectedValues.length < filteredOptions.length
                    }
                    isSelected={
                      selectedValues.length === filteredOptions.length
                    }
                    onValueChange={toggleAll}
                    className="flex items-center gap-2"
                    classNames={{
                      label: "text-sm",
                      wrapper: "rounded-sm",
                    }}
                  >
                    Select All
                  </Checkbox>
                </CommandItem>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isDisabled = option.disable; // Check if option is disabled

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => !isDisabled && toggleOption(option.value)}
                      className={cn(
                        "cursor-pointer py-2",
                        isDisabled && "opacity-50 cursor-not-allowed" // Disable styling
                      )}
                    >
                      <Checkbox
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        onValueChange={() =>
                          !isDisabled && toggleOption(option.value)
                        }
                        className="flex items-center gap-2"
                        classNames={{
                          label: "text-sm",
                          wrapper: "rounded-sm",
                        }}
                      >
                        {option.icon && (
                          <option.icon
                            className={cn(
                              "mr-2 h-4 w-4",
                              isDisabled ? "text-default-500" : ""
                            )}
                          />
                        )}
                        <span>{option.label}</span>
                      </Checkbox>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {/* <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="flex-1 justify-center cursor-pointer border-r"
                      >
                        Clear
                      </CommandItem>
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="flex-1 justify-center cursor-pointer max-w-full"
                  >
                    Close
                  </CommandItem>
                </div>
              </CommandGroup> */}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
