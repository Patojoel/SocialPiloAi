type Primitive = string | number | boolean | null | undefined

type CamelCase<S extends string> = S extends `${infer P}_${infer Q}`
  ? `${P}${Capitalize<CamelCase<Q>>}`
  : S

type ObjectToCamelCase<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Array<ObjectToCamelCase<U>>
    : {
        [K in keyof T as K extends string ? CamelCase<K> : K]: ObjectToCamelCase<T[K]>
      }

function camelize(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

export function toCamelCase<T>(obj: unknown): T {
  if (obj === null || typeof obj !== 'object') return obj as T
  if (Array.isArray(obj)) return obj.map((item) => toCamelCase(item)) as T
  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>).map(([key, value]) => [
      camelize(key),
      typeof value === 'object' && value !== null ? toCamelCase(value) : value,
    ]),
  ) as T
}

export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}
