import assert from "assert";
import { DerailleurResponse } from "../../utils/responseGenerators";

export type CreateRecordFunction = (...args: Array<any>) => Promise<DerailleurResponse<any>>;
interface AddMockDataProps {
  createRecordFunction: CreateRecordFunction;
  newRecordParams: Parameters<CreateRecordFunction>[];
  mockDataName?: 'Users' | 'Posts';
}

export async function addRecordsToDb(args: AddMockDataProps): Promise<DerailleurResponse<any>[][]> {
  const mockRecordResponses: DerailleurResponse<any>[][] = [];
  const { createRecordFunction, newRecordParams, mockDataName = 'MockData' } = args;
  const responses = await Promise.all(newRecordParams.map((params) => createRecordFunction(...params)))
    .catch((e: any) => {
      console.error(e);
      throw e;
    });
  for (let i = 0, limi = responses.length; i < limi; i++) {
    assert.notStrictEqual(responses[i].result, null, `Unable to creak mock ${mockDataName} records in database`);
  };
  mockRecordResponses.push(responses);
  return mockRecordResponses;
}