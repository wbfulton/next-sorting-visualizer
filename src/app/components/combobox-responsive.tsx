"use client";

import * as React from "react";

import { useMediaQuery } from "../hooks/useMediaQuery";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type ComboBoxItem = {
  value: string;
  label: string;
};

export const ComboBoxResponsive = ({
  defaultText,
  items,
  onSelectItems,
}: {
  defaultText: string;
  items: ComboBoxItem[];
  onSelectItems?: (item: ComboBoxItem | null) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedItems, setSelectedItems] = React.useState<ComboBoxItem | null>(
    null
  );

  React.useEffect(() => {
    onSelectItems?.(selectedItems);
  }, [selectedItems]);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedItems ? <>{selectedItems.label}</> : <>{defaultText}</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ItemsList
            items={items}
            setOpen={setOpen}
            setSelectedItems={setSelectedItems}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedItems ? <>{selectedItems.label}</> : <>{defaultText}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ItemsList
            items={items}
            setOpen={setOpen}
            setSelectedItems={setSelectedItems}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

function ItemsList({
  items,
  setOpen,
  setSelectedItems,
}: {
  items: ComboBoxItem[];
  setOpen: (open: boolean) => void;
  setSelectedItems: (items: ComboBoxItem | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Select..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={(value) => {
                setSelectedItems(
                  items.find((item) => item.value === value) || null
                );
                setOpen(false);
              }}
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
