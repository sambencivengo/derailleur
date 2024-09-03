'use server';
import { Menu } from 'lucide-react';
import { SideBarButtons } from '~/components/sideBarButtons';
import { ToggleDarkModeButton } from '~/components/toggleDarkModeButton';
import { SheetTrigger, SheetContent, Sheet } from '~/components/ui';

export async function MobileSideBarButtons() {
  return (
    <div className="flex md:hidden pr-2 gap-2">
      <Sheet>
        <SheetTrigger>
          <Menu size={30} />
        </SheetTrigger>
        <SheetContent side={'left'} dir="right" className="pt-10">
          <div className="flex flex-col justify-between  h-full py-4 ">
            <div className="flex flex-col gap-1">
              <SideBarButtons closeSheet={true} />
            </div>
            <div className="w-full flex justify-end">
              <ToggleDarkModeButton />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
