
import React from "react";

interface InfiniteScrollTriggerProps {
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  loadMoreText?: string;
  noMoreText?: string;
  classname?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const InfiniteScrollTrigger = ({
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  loadMoreText = "Load More",
  classname,
  noMoreText = "No More items",
  ref,
}: InfiniteScrollTriggerProps) => {
  let text = loadMoreText;

  if (isLoadingMore) {
    text = "Loading...";
  } else if (!canLoadMore) {
    text = noMoreText;
  }

  const classes = `flex w-full justify-center py-2 ${classname ?? ""}`.trim();

  return (
    <div className={classes} ref={ref}>
      <button
        type="button"
        disabled={!canLoadMore || isLoadingMore}
        onClick={onLoadMore}
        className="inline-flex items-center px-3 py-1 text-sm"
      >
        {text}
      </button>
    </div>
  );
};
