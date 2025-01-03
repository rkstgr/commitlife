// app/components/NewActivityModal.tsx
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import * as Dialog from "@radix-ui/react-dialog";

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
        <button className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 dark:hover:bg-green-700">
          Add New Activity
        </button>
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
                    className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400"
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
                    className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400"
                  >
                    <option value="EVERY_DAY">Every Day</option>
                    <option value="ONCE_A_WEEK">Once a Week</option>
                    <option value="TWICE_A_WEEK">Twice a Week</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 rounded"
                  >
                    Create
                  </button>
                </div>
              </div>
            </fetcher.Form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
