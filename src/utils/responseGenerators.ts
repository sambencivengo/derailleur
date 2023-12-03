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

export function createErrorResponse<T = any>(errors: DerailleurError[]): DerailleurResponse<T> {
  return ({ result: null, errors });
}

export function createNextResponse({ errors, status, response }: { errors?: DerailleurError[]; status: number; response?: string; }) {
  console.log(status);
  return NextResponse.json({ errors, response }, { status });
}