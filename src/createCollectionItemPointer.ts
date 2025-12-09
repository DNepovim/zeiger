import type { ExtractState, StoreApi, UseBoundStore } from 'zustand';
import { shallow } from 'zustand/shallow';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { getObjectPart } from './getObjectPart';

export function createCollectionItemPointer<
  S extends object,
  Store extends UseBoundStore<StoreApi<S>>,
  State extends ExtractState<Store>,
  CollectionKey extends {
    [P in keyof State]: State[P] extends unknown[] ? P : never;
  }[keyof State],
  Key extends keyof CollectionItem,
  Dep extends keyof CollectionItem,
  CollectionItem = State[CollectionKey] extends (infer Item)[] ? Item : never,
>(store: Store, collectionKey: CollectionKey, itemUniqueKey: Key) {
  return (
    itemUniqueValue: string,
    deps: Dep[],
  ): Pick<CollectionItem, Dep> | undefined =>
    useStoreWithEqualityFn<Store, Pick<CollectionItem, Dep> | undefined>(
      store,
      (state) => {
        const collection = (state as unknown as State)[
          collectionKey
        ] as CollectionItem[];
        const item = collection.find(
          (i) => i[itemUniqueKey] === itemUniqueValue,
        );

        if (typeof item === 'undefined') {
          return undefined;
        }
        return getObjectPart(item, deps);
      },
      shallow,
    );
}
