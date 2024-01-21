'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Badge, Command, CommandGroup, CommandItem, InputProps } from '~/components/ui';
import { Command as CommandPrimitive } from 'cmdk';
import { getTagsWithCountByName } from '~/queries';
import { TagWithPostCount } from '~/types';

type MultiSelectProps = InputProps & {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  selected: TagWithPostCount[];
  setSelected: React.Dispatch<React.SetStateAction<TagWithPostCount[]>>;
};

export const MultiSelect = React.forwardRef<HTMLInputElement, MultiSelectProps>(({ type, selected, setSelected, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const handleUnselect = React.useCallback((tag: TagWithPostCount) => {
    setSelected((prev) => prev.filter((s) => s.name !== tag.name));
  }, []);
  const [tags, setTags] = React.useState<TagWithPostCount[]>([]);

  const handleKeyDown = React.useCallback(async (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
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
          } else {
            setSelected((prev) => {
              const newSelected = [...prev, { id: trimmedValue, _count: { posts: 0 }, name: trimmedValue }];
              return newSelected;
            });
            setInputValue('');
          }
        }
      }

      // This is not a default behaviour of the <input /> field
      const response = await getTagsWithCountByName(input.value);
      setTags(response.result!);

      if (e.key === 'Escape') {
        input.blur();
      }
    }
  }, []);

  const selectables = tags.filter((tag) => !selected.includes(tag));

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
            onFocus={() => setOpen(true)}
            placeholder="Add tags..."
            className="uppercase placeholder:initial ml-2 bg-background outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
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
