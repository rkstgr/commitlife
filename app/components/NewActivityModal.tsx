// app/components/NewActivityModal.tsx
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "~/lib/utils";
import Button from "./Button";
import { Plus } from "lucide-react";

export function NewActivityModal() {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    fetcher.submit(new FormData(form), {
      method: "post",
      action: "/api/activities",
    });
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" className="inline-flex items-center gap-1">
          <Plus size={20} /> New Activity
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 dark:bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              New Activity
            </Dialog.Title>

            <fetcher.Form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-neutral-200"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className={cn(
                      "search-input w-full px-3 py-2 rounded-md transition-all duration-300"
                    )}
                  />
                </div>

                <div>
                  <label
                    htmlFor="targetRecurrence"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Goal
                  </label>
                  <select
                    id="targetRecurrence"
                    name="targetRecurrence"
                    required
                    className={cn(
                      "search-select w-full px-3 py-2 rounded-md transition-all duration-300"
                    )}
                  >
                    <option value="EVERY_DAY">Every Day</option>
                    <option value="ONCE_A_WEEK">Once a Week</option>
                    <option value="TWICE_A_WEEK">Twice a Week</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <Dialog.Close asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Button type="submit">Create</Button>
                </div>
              </div>
            </fetcher.Form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
