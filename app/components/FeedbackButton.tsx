// app/components/FeedbackButton.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/Dialog";
import { useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";
import { Frown, Meh, Smile, type LucideIcon } from "lucide-react";
import { action } from "~/routes/api.feedback";
import Button from "./Button";

type Sentiment = "negative" | "neutral" | "positive" | null;

interface SentimentButtonProps {
  icon: LucideIcon;
  value: Sentiment;
  selected: boolean;
  onClick: (value: Sentiment) => void;
}

function SentimentButton({
  icon: Icon,
  value,
  selected,
  onClick,
}: SentimentButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`p-3 sm:p-4 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
        selected ? "bg-neutral-100 dark:bg-neutral-800" : ""
      }`}
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
}

export default function FeedbackButton() {
  const fetcher = useFetcher<typeof action>();
  const [sentiment, setSentiment] = useState<Sentiment>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success && isOpen) {
      setSentiment(null);
      setIsOpen(false);
      fetcher.data = undefined;
    }
  }, [fetcher, fetcher.state, fetcher.data, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="outline" className="text-sm sm:text-base">
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-32px)] sm:w-full max-w-lg mx-4 sm:mx-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl">
            Leave Feedback
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            We&apos;d love to hear what went well or how we can improve the
            product experience.
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form method="post" action="/api/feedback" className="mt-4">
          <input type="hidden" name="sentiment" value={sentiment || ""} />

          <div className="flex gap-2 sm:gap-4 justify-center sm:justify-start mb-4">
            <SentimentButton
              icon={Frown}
              value="negative"
              selected={sentiment === "negative"}
              onClick={setSentiment}
            />
            <SentimentButton
              icon={Meh}
              value="neutral"
              selected={sentiment === "neutral"}
              onClick={setSentiment}
            />
            <SentimentButton
              icon={Smile}
              value="positive"
              selected={sentiment === "positive"}
              onClick={setSentiment}
            />
          </div>

          <div className="mb-4">
            <textarea
              name="feedback"
              rows={4}
              required
              placeholder="Tell us about your experience..."
              className="w-full p-3 text-base rounded-md bg-neutral-100 dark:bg-neutral-800 border-0 placeholder:text-neutral-500 search-input transition-all duration-300"
            />
            {fetcher.data?.errors?.feedback && (
              <p className="text-red-500 text-sm mt-1">
                {fetcher.data.errors.feedback}
              </p>
            )}
          </div>

          {fetcher.data?.errors?._form && (
            <p className="text-red-500 text-sm mb-4">
              {fetcher.data.errors._form}
            </p>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              {isSubmitting ? "Sending..." : "Send Feedback"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
