'use client';
import React from 'react';
import { XIcon } from 'lucide-react';
import { Dispatch, SetStateAction, forwardRef } from 'react';
import { InputProps, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui';

type InputTagsProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

// TODO: Update or remove now that fancy select is working
export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(({ type, value, onChange, ...props }, ref) => {
  const [pendingDataPoint, setPendingDataPoint] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [openSelect, setOpenSelect] = React.useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
  }
  const dummyArray = ['Banana', 'Blueberry', 'Grapes', 'Pineapple', 'Apple'];
  return (
    <div>
      <Select open={openSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          <SelectItem onClick={() => setOpenSelect(false)} value="thing">
            Light
          </SelectItem>
          <SelectItem onClick={() => setOpenSelect(false)} value="a">
            Light
          </SelectItem>
          <SelectItem onClick={() => setOpenSelect(false)} value="c">
            Light
          </SelectItem>
          <SelectItem onClick={() => setOpenSelect(false)} value="d">
            Light
          </SelectItem>
          <SelectItem onClick={() => setOpenSelect(false)} value="b">
            Light
          </SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-2 cursor-text h-10 w-full rounded-md border bg-background px-3 py-2 border-input text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:focus-visible:-visible:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <div className="flex flex-row gap-2">
          <Badge variant="secondary">
            <p className="whitespace-nowrap">Trip Report</p> <XIcon size="16" />
          </Badge>
          <Badge variant="secondary">
            <p className="whitespace-nowrap">Other Tag</p> <XIcon size="16" />
          </Badge>
          <Badge variant="secondary">
            <p className="whitespace-nowrap"> #Rig </p> <XIcon size="16" />
          </Badge>
          <Badge variant="secondary">
            <p className="whitespace-nowrap"> Bridgestone </p>
            <XIcon size="16" />
          </Badge>
        </div>
        <input type={type} ref={ref} onChange={onChange} {...props} onFocus={() => setOpenSelect(true)} className="flex-grow w-full rounded-md bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
      </div>
    </div>
  );
});
