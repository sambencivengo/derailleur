import { ZodError, z } from "zod";
import { DerailleurError, createErrorResponse, createSuccessfulResponse } from "~/utils";

interface ValidateSignUpProps<Z> {
  body: any;
  schema: z.ZodType<Z>;
}
export function validateSchema<Z>({ body, schema }: ValidateSignUpProps<Z>) {
  try {
    const values = schema.parse(body);
    return createSuccessfulResponse<Z>(values);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const { errors } = error;
      const errorMessages: DerailleurError[] = errors.map((error) => ({ data: {}, message: error.message }));
      return createErrorResponse<Z>(errorMessages);
    } else {
      return createErrorResponse<Z>([{ message: "Unable to validate request", data: {} }]);
    }
  }
}