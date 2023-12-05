
import { createPost, getUserById } from "~/queries";
import { CreatePostSchema, createPostSchema, validateSchema } from "~/schemas";
import { createNextResponse } from "~/utils";


export const POST = async (
  req: Request,
  { params }: { params: { userId: string; }; }
) => {

  const { userId } = params;
  const getUserResponse = await getUserById(userId);
  if (getUserResponse.errors.length > 0 || getUserResponse.result === null) {
    return (createNextResponse({ errors: getUserResponse.errors, status: 400 }));
  }

  const body = await req.json();
  const validateSchemaResponse = validateSchema<CreatePostSchema>({ body, schema: createPostSchema });
  if (validateSchemaResponse.result === null || validateSchemaResponse.errors.length > 0) {
    return (createNextResponse({ errors: validateSchemaResponse.errors, status: 400 }));
  }
  const { content, title, published } = validateSchemaResponse.result;
  try {
    const newPostResponse = await createPost({
      content, title, published
    }, userId);
    if (newPostResponse.errors.length > 0 || newPostResponse.result === null) {
      return (createNextResponse({ errors: newPostResponse.errors, status: 400 }));
    }
    const { result } = newPostResponse;
    return (createNextResponse({ result, status: 201 }));
  } catch (error) {
    return (createNextResponse({ errors: [{ message: "An unknown error occurred", data: {} }], status: 500 }));
  }
};