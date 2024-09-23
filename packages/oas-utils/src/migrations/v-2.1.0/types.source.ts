import type { Cookie as Ck } from '@/entities/cookie'
import type { Environment as E } from '@/entities/environment'
import type {
  Collection as Co,
  Request as R,
  RequestExample as RE,
  Server as S,
  SecurityScheme as SS,
  Tag as T,
} from '@/entities/spec'
import type { Workspace as W } from '@/entities/workspace'
import type { SimplifyDeep } from 'type-fest'

export type Cookie = SimplifyDeep<Ck>
export type Environment = SimplifyDeep<E>
export type Collection = SimplifyDeep<Co>
export type Request = SimplifyDeep<R>
export type RequestExample = SimplifyDeep<RE>
export type SecurityScheme = SimplifyDeep<SS>
export type Server = SimplifyDeep<S>
export type Tag = SimplifyDeep<T>
export type Workspace = SimplifyDeep<W>
