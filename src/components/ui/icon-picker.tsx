"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { TECH_ICON_OPTIONS, TechIcon, techIconLabel } from "@/components/tech-icons";
import { cn } from "@/lib/utils";

function slugifySlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "");
}

export default function IconPicker({
  value,
  onChange,
  disabled,
}: {
  value?: string;
  onChange: (key: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [customSlug, setCustomSlug] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);
  const previewSlug = slugifySlug(customSlug);

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setCustomSlug("");
          setPreviewFailed(false);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-[180px] justify-between"
        >
          <span className="flex items-center gap-2 truncate">
            <TechIcon icon={value} size={16} />
            {techIconLabel(value)}
          </span>
          <ChevronsUpDown size={16} className="ml-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search icons..." />
          <CommandList>
            <CommandEmpty>No icon found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="none"
                keywords={["none", "no icon"]}
                onSelect={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                <span className="text-muted-foreground">None</span>
                <Check
                  className={cn(
                    "ml-auto",
                    !value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
              {TECH_ICON_OPTIONS.map((option) => (
                <CommandItem
                  key={option.key}
                  value={option.key}
                  keywords={[option.label]}
                  onSelect={(current) => {
                    onChange(current === value ? "" : current);
                    setOpen(false);
                  }}
                >
                  <TechIcon icon={option.key} size={16} />
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.key ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="border-t p-2 space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border">
              {previewSlug && !previewFailed ? (
                <img
                  key={previewSlug}
                  src={`https://cdn.simpleicons.org/${previewSlug}`}
                  width={20}
                  height={20}
                  alt=""
                  onError={() => setPreviewFailed(true)}
                />
              ) : (
                <span className="text-[10px] text-muted-foreground">
                  {previewSlug ? "404" : "?"}
                </span>
              )}
            </span>
            <Input
              placeholder="Custom slug (e.g. ruby)"
              value={customSlug}
              onChange={(e) => {
                setCustomSlug(e.target.value);
                setPreviewFailed(false);
              }}
              className="h-8 text-xs"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled={!previewSlug || previewFailed}
            onClick={() => {
              onChange(previewSlug);
              setCustomSlug("");
              setPreviewFailed(false);
              setOpen(false);
            }}
          >
            Use “{previewSlug || "…"}” from simpleicons.org
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Any slug from simpleicons.org — preview loads live.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
