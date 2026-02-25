export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export function actionResult<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function actionError(message: string): ActionResult<never> {
  return { success: false, error: message };
}

export function isPrismaUniqueViolation(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "P2002";
}

export function isPrismaNotFound(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "P2025";
}
