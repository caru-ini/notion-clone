"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

type IconPickerProps = {
  onChange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
};

export const IconPicker: React.FC<IconPickerProps> = ({ onChange, children, asChild }) => {
  const { resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || "light") as "dark" | "light";

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className={"w-full border-none p-0 shadow-none"}>
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          theme={currentTheme}
        />
      </PopoverContent>
    </Popover>
  );
};
