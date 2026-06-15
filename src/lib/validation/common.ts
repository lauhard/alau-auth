/**
 * Preprocessor: normalize empty/whitespace-only strings to undefined.
 *
 * Bridges the gap between HTML form semantics (empty input → "")
 * and domain semantics (no value → undefined → NULL in DB).
 *
 * Used in conjunction with `z.preprocess()`:
 *
 *   contactEmail: z.preprocess(
 *       emptyToUndefined,
 *       z.email("...").optional()
 *   )
 *
 * Non-string inputs pass through unchanged — the inner Zod schema
 * handles type validation. This keeps the helper a pure normalizer
 * without entangling type-checking concerns.
 */
export const emptyToUndefined = (v: unknown): unknown =>
    typeof v === "string" && v.trim() === "" ? undefined : v;