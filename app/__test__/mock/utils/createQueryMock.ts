import { DerailleurResponse } from "../../../utils/responseGenerators";

type QueryResponse<R> = Promise<DerailleurResponse<R>>;
type CreateRecordFunction<R, F extends (...args: any) => QueryResponse<R>> = (...args: Parameters<F>) => QueryResponse<R>;
export interface TestQueryMockProps<R, F extends (...args: Parameters<F>) => QueryResponse<R>> {
  expectedResult: R;
  createRecordFunction: CreateRecordFunction<R, F>;
  mockFunctionResolvedValue: (result: R) => any;
  payload: Parameters<CreateRecordFunction<R, F>>;
  error?: any;
};

export async function testQueryMock<R, F extends (...args: Parameters<F>) => Promise<DerailleurResponse<R>>>(args: TestQueryMockProps<R, F>) {
  const { createRecordFunction, mockFunctionResolvedValue, payload, expectedResult, error } = args;
  mockFunctionResolvedValue(expectedResult);
  await expect(createRecordFunction(...payload)).resolves.toEqual<{ result: R, error: any; }>({
    result: expectedResult,
    error: error ?? null
  });
};


