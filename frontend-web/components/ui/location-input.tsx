// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import countries from "@/data/countries.json";
import states from "@/data/states.json";

interface CountryProps {
  id: number;
  name: string;
  iso2: string;
  emoji: string;
}

interface StateProps {
  id: number;
  name: string;
  country_id: number;
}

interface LocationSelectorProps {
  disabled?: boolean;
  onCountryChange?: (country: CountryProps | null) => void;
  onStateChange?: (state: StateProps | null) => void;
  defaultCountry?: string;
  defaultState?: string;
}

const LocationSelector = ({
  disabled,
  onCountryChange,
  onStateChange,
  defaultCountry,
  defaultState,
}: LocationSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryProps | null>(
    null
  );
  const [selectedState, setSelectedState] = useState<StateProps | null>(null);
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);

  const countriesData = countries as CountryProps[];
  const statesData = states as StateProps[];

  const availableStates = statesData.filter(
    (state) => state.country_id === selectedCountry?.id
  );

  useEffect(() => {
    if (defaultCountry) {
      const foundCountry = countriesData.find(
        (c) => c.name.toLowerCase() === defaultCountry.toLowerCase()
      );
      if (foundCountry) {
        setSelectedCountry(foundCountry);
        onCountryChange?.(foundCountry);
      }
    }
  }, [defaultCountry]);

  useEffect(() => {
    if (defaultState && selectedCountry) {
      const foundState = statesData.find(
        (s) =>
          s.name.toLowerCase() === defaultState.toLowerCase() &&
          s.country_id === selectedCountry.id
      );
      if (foundState) {
        setSelectedState(foundState);
        onStateChange?.(foundState);
      }
    }
  }, [defaultState, selectedCountry]);

  useEffect(() => {
    if (!defaultCountry) {
      async function detectUserCountry() {
        try {
          const response = await fetch("https://api.country.is/");
          if (!response.ok) throw new Error("Failed to get location");
          const data = await response.json();
          const detectedCountry =
            countriesData.find((c) => c.iso2 === data.country) ||
            countriesData.find((c) => c.iso2 === "US"); // Default to US
          if (detectedCountry) {
            setSelectedCountry(detectedCountry);
            onCountryChange?.(detectedCountry);
          }
        } catch (error) {
          console.error("Failed to detect country:", error);
          const defaultDetectedCountry = countriesData.find(
            (c) => c.iso2 === "US"
          );
          if (defaultDetectedCountry) {
            setSelectedCountry(defaultDetectedCountry);
            onCountryChange?.(defaultDetectedCountry);
          }
        }
      }

      detectUserCountry();
    }
  }, []);

  const handleCountrySelect = (countryName: string) => {
    const country = countriesData.find((c) => c.name === countryName) || null;
    setSelectedCountry(country);
    setSelectedState(null);
    onCountryChange?.(country);
    onStateChange?.(null);
    setOpenCountryDropdown(false);
  };

  const handleStateSelect = (stateName: string) => {
    const state = availableStates.find((s) => s.name === stateName) || null;
    setSelectedState(state);
    onStateChange?.(state);
    setOpenStateDropdown(false);
  };

  return (
    <div className="flex gap-4">
      {/* Country Selector */}
      <Popover open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCountryDropdown}
            disabled={disabled}
            className="w-full justify-between"
          >
            {selectedCountry ? (
              <div className="flex items-center gap-2">
                <span>{selectedCountry.emoji || "🌍"}</span>
                <span>{selectedCountry.name}</span>
              </div>
            ) : (
              <span>Select Country...</span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[300px]">
                  {countriesData.map((country) => (
                    <CommandItem
                      key={country.id}
                      value={country.name}
                      onSelect={handleCountrySelect}
                      className="flex cursor-pointer items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{country.emoji || "🌍"}</span>
                        <span>{country.name}</span>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedCountry?.id === country.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* State Selector */}
      {availableStates.length > 0 && (
        <Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStateDropdown}
              disabled={!selectedCountry}
              className="w-full justify-between"
            >
              {selectedState ? (
                <span>{selectedState.name}</span>
              ) : (
                <span>Select State...</span>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search state..." />
              <CommandList>
                <CommandEmpty>No state found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {availableStates.map((state) => (
                      <CommandItem
                        key={state.id}
                        value={state.name}
                        onSelect={handleStateSelect}
                        className="flex cursor-pointer items-center justify-between text-sm"
                      >
                        <span>{state.name}</span>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedState?.id === state.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default LocationSelector;
