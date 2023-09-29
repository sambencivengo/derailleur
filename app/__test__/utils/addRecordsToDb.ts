import assert from "assert";
import { DerailleurResponse } from "../../utils/responseGenerators";

export type QueryResponse<R> = Promise<DerailleurResponse<R>>;
export type CreateRecordFunction<R, F extends (...args: any) => QueryResponse<R>> = (...args: Parameters<F>) => QueryResponse<R>;
interface AddMockDataProps<R, F extends (...args: any) => QueryResponse<R>> {
  createRecordFunction: CreateRecordFunction<R, F>;
  newRecordParams: Parameters<CreateRecordFunction<R, F>>[];
}

export async function addRecordsToDb<R, F extends (...args: Parameters<F>) => Promise<DerailleurResponse<R>>>
  (...args: AddMockDataProps<R, F>[]) {
  for (let i = 0, limi = args.length; i < limi; i++) {
    const { createRecordFunction, newRecordParams } = args[i];
    const responses = await Promise.all(newRecordParams.map((params) => createRecordFunction(...params)))
      .catch((e: any) => {
        console.error(e);
        throw e;
      });
    for (let i = 0, limi = responses.length; i < limi; i++) {
      assert(responses[i].result, 'Unable to creak mock records in database');
    };
    return responses;
  }
}



