import { NextResponse } from "next/server";

export interface DerailleurError {
  message: string,
  data: string | { [key: string]: any; };
}
export interface DerailleurResponse<T = any> {
  result: T | null;
  errors: DerailleurError[];
}

export function createSuccessfulResponse<T = any>(result: T): DerailleurResponse<T> {
  return ({ result, errors: [] });
}

export function createDerailleurError(message: string, data: string | { [key: string]: any; }): DerailleurError {
  return ({ data, message });
}

export function createErrorResponse<T = any>(errors: DerailleurError[]): DerailleurResponse<T> {
  return ({ result: null, errors });
}

export function createNextResponse({ errors, status, result }: { errors?: DerailleurError[]; status: number; result?: string | { [key: string]: any; }; }) {
  return NextResponse.json({ errors, result }, { status });
}