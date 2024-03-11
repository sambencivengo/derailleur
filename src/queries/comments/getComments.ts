'use server';

import { Prisma } from "@prisma/client";
import { Comment } from "~/types";
import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
import prisma from "~prisma/prisma";

// 5 levels of children hard coded,
// Paginate and run the query on a new page on the client when we need to reach the 6th level
export const getComments = async (postId?: string, parentCommentId?: string): Promise<DerailleurResponse<Comment[]>> => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentCommentId
      },
      include: {
        author: {
          select: {
            username: true,
            id: true
          }
        },
        // first level of children
        replies: {
          include: {
            author: {
              select: {
                username: true,
                id: true
              }
            },
            // second level of children
            replies: {
              include: {
                author: {
                  select: {
                    username: true,
                    id: true
                  }
                },
                // third level of children
                replies: {
                  include: {
                    author: {
                      select: {
                        username: true,
                        id: true
                      }
                    },
                    // fourth level of children
                    replies: {
                      include: {
                        author: {
                          select: {
                            username: true,
                            id: true
                          }
                        },
                        // fifth level of children
                        replies: {
                          include: {
                            author: {
                              select: {
                                username: true,
                                id: true
                              }
                            },
                            // Count replies, if the number is greater than zero
                            // We go to a new dynamic page and get the next set of 5 levels of children
                            _count: {
                              select: {
                                replies: true
                              }
                            }
                          },
                        }
                      }
                    }
                  },
                }
              }
            },
          }
        }
      }
    });

    return createSuccessfulResponse(comments);

  } catch (error: any) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return createErrorResponse([{ message: 'An error occurred when trying to get comments', data: { postId, error: JSON.stringify(error) } }]);
    }
    const errResponse = { postId, prismaErrorCode: error.code };
    return createErrorResponse([{ message: 'Unable to find comments due to prisma error', data: errResponse }]);
  }
};
// 'use server';

// import { Prisma } from "@prisma/client";
// import { Comment } from "~/types";
// import { DerailleurResponse, createErrorResponse, createSuccessfulResponse } from "~/utils";
// import prisma from "~prisma/prisma";

// export const getComments = async (postId?: string, take: number = 10, cursor?: string, repliesTake: number = 5, repliesCursor?: string, userId?: string): Promise<DerailleurResponse<Comment[]>> => {
//   try {
//     const comments = await prisma.comment.findMany({
//       take,
//       cursor: cursor ? { id: cursor } : undefined,
//       skip: cursor ? 1 : 0,
//       where: {
//         postId: postId,
//         authorId: userId,
//         parentCommentId: null
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//       include: {
//         author: {
//           select: {
//             id: true,
//             username: true
//           }
//         },
//         replies: {
//           take: repliesTake,
//           cursor: repliesCursor ? { id: repliesCursor } : undefined,
//           skip: repliesCursor ? 1 : 0,
//           include: {
//             author: {
//               select: {
//                 id: true,
//                 username: true
//               }
//             },
//           }
//         }
//       }
//     });

//     return createSuccessfulResponse(comments);

//   } catch (error: any) {
//     if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
//       return createErrorResponse([{ message: 'An error occurred when trying to get comments', data: { userId, postId, error: JSON.stringify(error) } }]);
//     }
//     const errResponse = { userId, postId, prismaErrorCode: error.code };
//     return createErrorResponse([{ message: 'Unable to find comments due to prisma error', data: errResponse }]);
//   }
// };