'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Badge, Command, CommandGroup, CommandItem, InputProps } from '~/components/ui';
import { Command as CommandPrimitive } from 'cmdk';
import { TagWithPostCount } from '~/types';

type MultiSelectProps = InputProps & {
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  selected: TagWithPostCount[];
  setSelected: React.Dispatch<React.SetStateAction<TagWithPostCount[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAndSetTags(value: string): Promise<void>;
  tags: TagWithPostCount[];
};

export const MultiSelect = React.forwardRef<HTMLInputElement, MultiSelectProps>(({ type, selected, setSelected, fetchAndSetTags, tags, setOpen, open, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState('');
  const handleUnselect = React.useCallback((tag: TagWithPostCount) => {
    setSelected((prev) => prev.filter((s) => s.name !== tag.name));
  }, []);

  let typingTimer: string | number | NodeJS.Timeout | undefined;
  const selectables = tags.filter((tag) => !selected.includes(tag));
  console.log(tags);
  const handleKeyDown = React.useCallback(async (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => fetchAndSetTags(input.value), 500);
      if (selectables.length > 0) setOpen(true);

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '') {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      const trimmedValue = input.value.trim();
      if (e.key === 'Tab') {
        if (trimmedValue === '') {
          return;
        } else {
          const tagIsAlreadySelected = selected.find((tag) => tag.name === trimmedValue);
          if (tagIsAlreadySelected) {
            setInputValue('');
            if (selectables.length === 0) setOpen(false);
          } else {
            setSelected((prev) => {
              const newSelected = [...prev, { id: trimmedValue, _count: { posts: 0 }, name: trimmedValue }];
              return newSelected;
            });
            setInputValue('');
            if (selectables.length === 0) setOpen(false);
          }
        }
      }

      if (e.key === 'Escape') {
        input.blur();
      }
    }
  }, []);

  console.log('SELECTABLES', selectables);
  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group bg-background border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((tag, idx) => {
            return (
              <Badge key={idx} variant="secondary">
                {tag.name.toUpperCase()}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(tag);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(tag)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => {
              setOpen(false);
              if (inputValue.trim().length > 0) {
                setSelected((prev) => [...prev, { _count: { posts: 0 }, id: inputValue, name: inputValue }]);
              }
              setInputValue('');
            }}
            onFocus={() => {
              if (selectables.length > 0) setOpen(true);
            }}
            placeholder="Add tags..."
            className="uppercase placeholder:initial ml-2 bg-background outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open ? (
          <div className="absolute w-full z-100 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((tag, idx) => {
                return (
                  <CommandItem
                    key={idx}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={(value) => {
                      setInputValue('');
                      setSelected((prev) => [...prev, tag]);
                    }}
                    className={'cursor-pointer'}
                  >
                    <p>{tag.name.toUpperCase()}</p> <p>{`${tag._count.posts} post${tag._count.posts > 1 ? 's' : ''}`}</p>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
});
