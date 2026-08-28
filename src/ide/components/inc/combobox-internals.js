/* combobox-internals.js
 * Pure helpers for <searchable-combobox>. No DOM access, no component state,
 * so every tricky bit (vnode parsing, matching, keyboard math, flip logic)
 * stays unit-testable.
 */
import { Fragment, Comment } from 'vue'

export const OPTION_MARKER = '__isOptionEx'

export function isOptionVNode(vnode) {
  const t = vnode && vnode.type
  return !!(t && typeof t === 'object' && t[OPTION_MARKER])
}

/* ------------------------------------------------------------------ *
 * 1. Reading <option-ex> out of the default slot
 * ------------------------------------------------------------------ */

/** Walk slot children and collect every <option-ex> vnode, in document order.
 *  Handles v-for (Fragment), v-if (Comment / Fragment), <template>, nested
 *  slot outlets and stray whitespace text nodes. */
export function flattenOptionVNodes(children, out = []) {
  if (children == null) return out
  const arr = Array.isArray(children) ? children : [children]
  for (const node of arr) {
    if (node == null || typeof node === 'boolean') continue
    if (Array.isArray(node)) { flattenOptionVNodes(node, out); continue }
    if (typeof node !== 'object') continue // bare text between options
    if (node.type === Comment) continue
    if (isOptionVNode(node)) { out.push(node); continue }
    if (node.type === Fragment) { flattenOptionVNodes(node.children, out); continue }
    // A component wrapping options is intentionally not traversed: its
    // children belong to that component, not to us.
  }
  return out
}

/** The renderable children of an <option-ex>. Compiled slots arrive as
 *  { default: fn }, plain children as an array or a string. */
export function optionContent(vnode) {
  const c = vnode.children
  if (c == null) return []
  if (Array.isArray(c)) return c
  if (typeof c === 'object' && typeof c.default === 'function') return toArray(c.default())
  return [String(c)]
}

const toArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v])

/** Flatten a vnode tree down to its text, for the search index / a11y label. */
export function vnodeText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out }
  if (Array.isArray(node)) { for (const n of node) vnodeText(n, out); return out }
  if (typeof node !== 'object') return out
  if (node.type === Comment) return out
  const c = node.children
  if (typeof c === 'string' || typeof c === 'number') { out.push(String(c)); return out }
  if (Array.isArray(c)) { vnodeText(c, out); return out }
  if (c && typeof c === 'object' && typeof c.default === 'function') { vnodeText(c.default(), out); return out }
  return out
}

export function textOf(nodes) {
  return vnodeText(nodes).join('').replace(/\s+/g, ' ').trim()
}

/* ------------------------------------------------------------------ *
 * 2. Matching
 * ------------------------------------------------------------------ */

const AR_DIGITS = /[\u0660-\u0669]/g   // ٠١٢...
const FA_DIGITS = /[\u06F0-\u06F9]/g   // ۰۱۲...
const MARKS = /[\u064B-\u0652\u0670\u0640\u200c\u200f\u200e]/g // harakat, tatweel, ZWNJ, marks

/** Fold text so that search is case-, accent-, ZWNJ- and Arabic/Persian
 *  spelling-insensitive ("كيبورد" matches "کیبورد", "۱۲" matches "12"). */
export function normalizeText(input) {
  if (input == null) return ''
  let t = String(input).toLowerCase()
  t = t.replace(FA_DIGITS, (d) => String(d.charCodeAt(0) - 0x06f0))
  t = t.replace(AR_DIGITS, (d) => String(d.charCodeAt(0) - 0x0660))
  t = t.replace(/[\u064A\u0649]/g, '\u06CC') // ي ى -> ی
  t = t.replace(/\u0643/g, '\u06A9')         // ك -> ک
  t = t.replace(/[\u0623\u0625\u0622]/g, '\u0627') // أ إ آ -> ا
  t = t.replace(/[\u0629\u06C0]/g, '\u0647')       // ة ۀ -> ه
  t = t.replace(MARKS, '')
  try { t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '') } catch (_) { /* older WebKit */ }
  return t.replace(/\s+/g, ' ').trim()
}

export function defaultMatch(option, normalizedQuery) {
  return option.search.indexOf(normalizedQuery) !== -1
}

/* ------------------------------------------------------------------ *
 * 3. Keyboard movement over a filtered list
 * ------------------------------------------------------------------ */

export function step(items, from, dir, loop = false) {
  const n = items.length
  if (!n) return -1
  let i = from
  for (let c = 0; c < n; c++) {
    i += dir
    if (i < 0 || i >= n) {
      if (!loop) return -1
      i = i < 0 ? n - 1 : 0
    }
    if (!items[i].disabled) return i
  }
  return -1
}

export const firstEnabled = (items) => step(items, -1, 1, false)
export const lastEnabled = (items) => step(items, items.length, -1, false)

/** action: next | prev | first | last | pageDown | pageUp */
export function moveActive(items, current, action, { loop = false, page = 10 } = {}) {
  if (!items.length) return -1
  switch (action) {
    case 'first': return firstEnabled(items)
    case 'last': return lastEnabled(items)
    case 'next': {
      if (current < 0) return firstEnabled(items)
      const i = step(items, current, 1, loop)
      return i === -1 ? current : i
    }
    case 'prev': {
      if (current < 0) return lastEnabled(items)
      const i = step(items, current, -1, loop)
      return i === -1 ? current : i
    }
    case 'pageDown':
    case 'pageUp': {
      const dir = action === 'pageDown' ? 1 : -1
      let i = current < 0 ? (dir === 1 ? firstEnabled(items) : lastEnabled(items)) : current
      for (let c = 0; c < page; c++) {
        const next = step(items, i, dir, false)
        if (next === -1) break
        i = next
      }
      return i
    }
    default: return current
  }
}

/* ------------------------------------------------------------------ *
 * 4. Placement — flip up when there is no room below
 * ------------------------------------------------------------------ */

/** Returns fixed-position styles for the popup. Anchored by `top` when it
 *  opens downwards and by `bottom` when it flips, so it always grows away
 *  from the control instead of over it. */
export function resolvePlacement({
  rect,
  viewportHeight,
  viewportWidth,
  contentHeight = 0,
  maxHeight = 280,
  minHeight = 112,
  gap = 4,
  margin = 8,
  preferred = 'bottom',
  matchWidth = true,
  minWidth = 0,
}) {
  const spaceBelow = viewportHeight - rect.bottom - gap - margin
  const spaceAbove = rect.top - gap - margin
  const desired = Math.min(maxHeight, contentHeight > 0 ? contentHeight : maxHeight)

  let placement = preferred === 'top' ? 'top' : 'bottom'
  if (preferred === 'top' || preferred === 'bottom' || preferred === 'auto') {
    const p = preferred === 'auto' ? 'bottom' : preferred
    const own = p === 'top' ? spaceAbove : spaceBelow
    const other = p === 'top' ? spaceBelow : spaceAbove
    placement = own < Math.min(desired, minHeight) && other > own ? (p === 'top' ? 'bottom' : 'top') : p
  }

  const space = placement === 'top' ? spaceAbove : spaceBelow
  const height = Math.max(48, Math.min(desired, space))
  const width = Math.max(minWidth, matchWidth ? rect.width : minWidth)

  let left = rect.left
  if (left + width > viewportWidth - margin) left = viewportWidth - margin - width
  if (left < margin) left = margin

  const style = {
    position: 'fixed',
    left: Math.round(left) + 'px',
    width: Math.round(width) + 'px',
    maxHeight: Math.round(height) + 'px',
  }
  if (placement === 'top') style.bottom = Math.round(viewportHeight - rect.top + gap) + 'px'
  else style.top = Math.round(rect.bottom + gap) + 'px'

  return { placement, style, availableHeight: space, height }
}

/* ------------------------------------------------------------------ *
 * 5. Ids (module scope, so every instance gets a unique listbox id)
 * ------------------------------------------------------------------ */
let idSeq = 0
export const nextId = (prefix = 'sc') => `${prefix}${++idSeq}`
