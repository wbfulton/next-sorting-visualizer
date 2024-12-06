"use client";

import * as React from "react";

import { Check } from "lucide-react";
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
  defaultSelectedItem,
  items,
  onSelectItem,
}: {
  defaultText: string;
  defaultSelectedItem?: ComboBoxItem;
  items: ComboBoxItem[];
  onSelectItem?: (item: ComboBoxItem | undefined) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedItem, setSelectedItem] = React.useState<
    ComboBoxItem | undefined
  >(defaultSelectedItem);

  React.useEffect(() => {
    onSelectItem?.(selectedItem);
  }, [selectedItem]);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedItem ? <>{selectedItem.label}</> : <>{defaultText}</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ItemsList
            selectedItem={selectedItem}
            items={items}
            setOpen={setOpen}
            setSelectedItem={setSelectedItem}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedItem ? <>{selectedItem.label}</> : <>{defaultText}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ItemsList
            selectedItem={selectedItem}
            items={items}
            setOpen={setOpen}
            setSelectedItem={setSelectedItem}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

function ItemsList({
  items,
  setOpen,
  setSelectedItem,
  selectedItem,
}: {
  selectedItem?: ComboBoxItem;
  items: ComboBoxItem[];
  setOpen: (open: boolean) => void;
  setSelectedItem: (items: ComboBoxItem | undefined) => void;
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
                setSelectedItem(
                  items.find((item) => item.value === value) || undefined
                );
                setOpen(false);
              }}
            >
              {item.label}
              {selectedItem?.value === item.value && <Check />}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
