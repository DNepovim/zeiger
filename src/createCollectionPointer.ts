import type { ExtractState, StoreApi, UseBoundStore } from 'zustand';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { getObjectPart } from './getObjectPart';

export function createCollectionPointer<
  S extends object,
  Store extends UseBoundStore<StoreApi<S>>,
  State extends ExtractState<Store>,
  CollectionKey extends {
    [P in keyof State]: State[P] extends unknown[] ? P : never;
  }[keyof State],
  Dep extends keyof CollectionItem,
  CollectionItem = State[CollectionKey] extends (infer Item)[] ? Item : never,
>(store: Store, collectionKey: CollectionKey) {
  return (
    deps: Dep[],
    filterFn?: (item: CollectionItem, state: ExtractState<Store>) => boolean,
  ): Pick<CollectionItem, Dep>[] =>
    useStoreWithEqualityFn<Store, Pick<CollectionItem, Dep>[]>(
      store,
      (state) => {
        const collection = (state as unknown as State)[
          collectionKey
        ] as CollectionItem[];
        const filtered = filterFn
          ? collection.filter((item) => filterFn(item, state))
          : collection;

        return filtered.reduce<Pick<CollectionItem, Dep>[]>(
          (acc, item) => Object.assign(acc, getObjectPart(item, deps)),
          [],
        );
      },
      (prev, cur) =>
        prev.length === cur.length &&
        prev.every((item, index) =>
          deps.every((key) => item[key] === cur[index]?.[key]),
        ),
    );
}
