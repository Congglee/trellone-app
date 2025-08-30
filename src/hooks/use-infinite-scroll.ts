import { useCallback, useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  /**
   * Function to call when the user scrolls near the bottom
   */
  onLoadMore: () => void
  /**
   * Whether there are more items to load
   */
  hasMore: boolean
  /**
   * Whether a request is currently in progress
   */
  isLoading: boolean
  /**
   * Distance from bottom (in pixels) to trigger loading more items
   * @default 100
   */
  threshold?: number
  /**
   * Whether to use window scroll instead of container scroll
   * @default false
   */
  useWindowScroll?: boolean
}

/**
 * Custom hook for implementing infinite scroll functionality
 *
 * @param options Configuration options for infinite scroll behavior
 * @returns Object containing ref to attach to the container element (only needed for container scroll)
 *
 * @example
 * ```typescript
 * // Container scroll (default)
 * const { containerRef } = useInfiniteScroll({
 *   onLoadMore: loadMoreItems,
 *   hasMore: pagination.page < pagination.total_page,
 *   isLoading: isLoadingMore
 * })
 *
 * // Window scroll
 * const { containerRef } = useInfiniteScroll({
 *   onLoadMore: loadMoreItems,
 *   hasMore: pagination.page < pagination.total_page,
 *   isLoading: isLoadingMore,
 *   useWindowScroll: true
 * })
 * ```
 */
export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 100,
  useWindowScroll = false
}: UseInfiniteScrollOptions) => {
  const containerRef = useRef<HTMLElement>(null)

  // Validation
  if (!onLoadMore || typeof onLoadMore !== 'function') {
    throw new Error('onLoadMore must be a function')
  }

  if (typeof hasMore !== 'boolean') {
    throw new Error('hasMore must be a boolean')
  }

  if (typeof isLoading !== 'boolean') {
    throw new Error('isLoading must be a boolean')
  }

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) {
      return
    }

    if (useWindowScroll) {
      // Window scroll logic
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement

      // Only load when user actually scrolled down
      if (scrollTop <= 0) return

      const distanceFromBottom = scrollHeight - scrollTop - clientHeight

      // Trigger load more when user is within threshold distance from bottom
      if (distanceFromBottom <= threshold) {
        onLoadMore()
      }
    } else {
      // Container scroll logic
      const container = containerRef.current
      if (!container) {
        return
      }

      const { scrollTop, scrollHeight, clientHeight } = container

      // Only load when there is overflow and user actually scrolled down
      if (scrollTop <= 0 || scrollHeight <= clientHeight) return

      const distanceFromBottom = scrollHeight - scrollTop - clientHeight

      // Trigger load more when user is within threshold distance from bottom
      if (distanceFromBottom <= threshold) {
        onLoadMore()
      }
    }
  }, [onLoadMore, isLoading, hasMore, threshold, useWindowScroll])

  useEffect(() => {
    if (useWindowScroll) {
      // Add window scroll event listener
      window.addEventListener('scroll', handleScroll, { passive: true })

      // Cleanup function
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    } else {
      // Container scroll logic
      const container = containerRef.current

      if (!container) {
        return
      }

      // Add scroll event listener
      container.addEventListener('scroll', handleScroll, { passive: true })

      // Cleanup function
      return () => {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll, useWindowScroll])

  return { containerRef }
}
