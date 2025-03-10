/**
 * Maps an array of objects to a new array sorted based on a specified order.
 *
 * @template T - Type of the objects in the array extending Record<K, V>
 * @template K - Type of the key in the object (string | number | symbol)
 * @template V - Type of the value associated with the key
 *
 * @param {T[] | undefined | null} originalArray - The original array to be sorted
 * @param {V[] | undefined | null} orderArray - Array that defines the desired order of elements
 * @param {K} key - The key in the objects whose value is used for ordering
 *
 * @returns {T[]} A new sorted array based on the order specified in orderArray
 *
 * @example
 * // Sorting cards based on columnId order
 * const sortedCards = mapOrder(cards, columnOrder, 'columnId');
 */
export const mapOrder = <T extends Record<K, V>, K extends string | number | symbol, V>(
  originalArray: T[] | undefined | null,
  orderArray: V[] | undefined | null,
  key: K
): T[] => {
  if (!originalArray || !orderArray || !key) return []

  return [...originalArray].sort((a, b) => orderArray.indexOf(a[key]) - orderArray.indexOf(b[key]))
}
