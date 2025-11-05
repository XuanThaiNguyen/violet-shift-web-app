"use client";
import * as React from "react";
import { ChevronDown, XIcon, CheckIcon } from "lucide-react";
import {
  cn,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  type PopoverProps,
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

export type OptionValue = string | number;

export type SelectClasses = {
  content?: string;
  trigger?: string;
  label?: string;
  input?: string;
  list?: string;
  item?: string;
  group?: string;
  empty?: string;
  icon?: string;
};

export type SelectOption = {
  label: React.ReactNode;
  value: OptionValue;
  icon?: React.ComponentType<{ className?: string }>;
  disable?: boolean;
};

/**
 * Props for Select component
 */
interface SelectProps extends Omit<PopoverProps, "children"> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: SelectOption[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange?: (value: OptionValue | undefined) => void;

  /** The default selected values when the component mounts. */
  defaultValue?: OptionValue;
  /** The selected values when the component is controlled. */
  value?: OptionValue;

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

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
  classNames?: SelectClasses;
  label?: string;
  clearable?: boolean;

  emptyComponent?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      onValueChange,
      defaultValue,
      value,
      placeholder = "Select options",
      isDismissable = true,
      className,
      classNames,
      label,
      emptyComponent,
      clearable = false,
      ...props
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = useControlledState<
      OptionValue | undefined
    >({
      defaultValue,
      value,
      onChange: onValueChange,
      undefinedSync: false,
    });

    const optionMap = React.useMemo(() => {
      return options.reduce((acc, option) => {
        acc[option.value] = option;
        return acc;
      }, {} as Record<OptionValue, SelectOption>);
    }, [options]);

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const _id = useId();
    const id = props.id || _id;

    const handleClear = () => {
      if (clearable) {
        setSelectedValue(undefined);
      }
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const selected = selectedValue ? optionMap[selectedValue] : undefined;
    const IconComponent = selected?.icon;

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
              {selected ? (
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-wrap items-center gap-1 p-1">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    <span>{selected.label}</span>
                  </div>
                  <div className="flex items-center justify-between text-default-foreground gap-3">
                    {clearable && (
                      <XIcon
                        strokeWidth={1}
                        className="h-4 cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleClear();
                        }}
                        size={16}
                      />
                    )}
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
        <PopoverContent
          className={cn("w-auto p-0 min-w-full", classNames?.content)}
        >
          <Command>
            <CommandInput
              classNames={{ wrapper: "border-divider h-10" }}
              placeholder="Search..."
            />
            <CommandList className="hidden-scrollbar">
              <CommandEmpty>
                {emptyComponent ? emptyComponent : "No results found."}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValue === option.value;
                  const isDisabled = option.disable; // Check if option is disabled
                  const IconComponent = option.icon;

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (!isDisabled) {
                          setSelectedValue(option.value);
                          handleTogglePopover();
                        }
                      }}
                      className={cn(
                        "cursor-pointer py-2 flex items-center justify-between gap-2 text-sm",
                        "hover:bg-default-100",
                        isDisabled && "opacity-50 cursor-not-allowed", // Disable styling
                        classNames?.item
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {IconComponent && (
                          <IconComponent
                            className={cn(
                              "mr-2 h-4 w-4",
                              isDisabled ? "text-default-500" : "",
                              classNames?.icon
                            )}
                          />
                        )}
                        <span>{option.label}</span>
                      </div>
                      {isSelected && <CheckIcon className="h-4 w-4" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

Select.displayName = "Select";
