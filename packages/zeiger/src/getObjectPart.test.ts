import { describe, expect, it } from 'vitest';
import { getObjectPart } from './getObjectPart';

describe('getObjectPart', () => {
  it('should return an empty object when given empty keys array', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = getObjectPart(obj, []);
    expect(result).toEqual({});
  });

  it('should pick a single key from object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = getObjectPart(obj, ['a']);
    expect(result).toEqual({ a: 1 });
  });

  it('should pick multiple keys from object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = getObjectPart(obj, ['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('should pick all keys when all are specified', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = getObjectPart(obj, ['a', 'b', 'c']);
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should work with different value types', () => {
    const obj = {
      str: 'hello',
      num: 42,
      bool: true,
      arr: [1, 2, 3],
      nested: { x: 1 },
      nullable: null,
      undef: undefined,
    };
    const result = getObjectPart(obj, ['str', 'num', 'bool', 'arr', 'nested']);
    expect(result).toEqual({
      str: 'hello',
      num: 42,
      bool: true,
      arr: [1, 2, 3],
      nested: { x: 1 },
    });
  });

  it('should handle undefined values', () => {
    const obj = { a: 1, b: undefined, c: 3 };
    const result = getObjectPart(obj, ['a', 'b']);
    expect(result).toEqual({ a: 1, b: undefined });
  });

  it('should handle null values', () => {
    const obj = { a: 1, b: null, c: 3 };
    const result = getObjectPart(obj, ['a', 'b']);
    expect(result).toEqual({ a: 1, b: null });
  });

  it('should preserve object reference equality for nested objects', () => {
    const nested = { x: 1 };
    const obj = { a: 1, nested };
    const result = getObjectPart(obj, ['nested']);
    expect(result.nested).toBe(nested);
  });

  it('should work with interface types', () => {
    interface User {
      id: string;
      name: string;
      email: string;
      age: number;
    }
    const user: User = {
      id: '1',
      name: 'John',
      email: 'john@example.com',
      age: 30,
    };
    const result = getObjectPart(user, ['id', 'name']);
    expect(result).toEqual({ id: '1', name: 'John' });
  });
});
