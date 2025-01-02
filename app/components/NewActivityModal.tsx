// app/components/NewActivityModal.tsx
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Dialog as HeadlessDialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export function NewActivityModal() {
  const [isOpen, setIsOpen] = useState(false);
  const fetcher = useFetcher();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    fetcher.submit(new FormData(form), {
      method: "post",
      action: "/api/activities",
    });
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add New Activity
      </button>

      <HeadlessDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-lg p-6 max-w-sm w-full">
            <DialogTitle className="text-xl font-semibold mb-4">
              New Activity
            </DialogTitle>

            <fetcher.Form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="targetRecurrence"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Goal
                  </label>
                  <select
                    id="targetRecurrence"
                    name="targetRecurrence"
                    required
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                  >
                    <option value="EVERY_DAY">Every Day</option>
                    <option value="ONCE_A_WEEK">Once a Week</option>
                    <option value="TWICE_A_WEEK">Twice a Week</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded"
                  >
                    Create
                  </button>
                </div>
              </div>
            </fetcher.Form>
          </DialogPanel>
        </div>
      </HeadlessDialog>
    </>
  );
}
