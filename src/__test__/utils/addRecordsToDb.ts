import assert from "assert";
import { Prisma } from "@prisma/client";
import { DerailleurResponse } from "~/utils";


export type CreateRecordFunction<R, F extends (...args: any) => Promise<DerailleurResponse<R>>> = (...args: Parameters<F>) => Promise<DerailleurResponse<R>>;

export interface AddMockDataProps<R, F extends (...args: any) => Promise<DerailleurResponse<R>>> {
  createRecordFunction: CreateRecordFunction<R, F>;
  newRecordParams: Parameters<CreateRecordFunction<R, F>>[];
  mockDataName?: Prisma.ModelName;
};

export async function addRecordsToDb<R, F extends (...args: Parameters<F>) => Promise<DerailleurResponse<R>>>
  (args: AddMockDataProps<R, F>): Promise<DerailleurResponse<any>[][]> {
  const mockRecordResponses: DerailleurResponse<any>[][] = [];
  const { createRecordFunction, newRecordParams, mockDataName = 'MockData' } = args;

  const responses = await Promise.all(newRecordParams.map((params) => createRecordFunction(...params)))
    .catch((e: any) => {
      console.error(e);
      throw e;
    });
  for (let i = 0, limi = responses.length; i < limi; i++) {
    assert.notStrictEqual(responses[i].result, null, `Unable to create mock ${mockDataName} records in database`);
  };
  mockRecordResponses.push(responses);
  return mockRecordResponses;
}