import { Prisma, PrismaClient, Post } from "@prisma/client";
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import moment from "moment";
import { User } from "~/types";


function generateRandomNumberInLimit(min: number = 1, max: number = 10) {
  return Math.floor(Math.random() * (max - min) + min);
};

const TAGS = [
  "BIKEPACKING",
  "RIG",
  "VINTAGE MOUNTAIN BIKE",
  "VINTAGE",
  "RAT BIKE",
  "TOURING",
  "BIKEPACK",
  "LONG TRIP",
  "WEEKENDER",
  "STEEL",
  "ALUMINUM",
  "26 AINT DEAD",
  '26"',
];

function createRandomNumberOfTags(numberOfTags: number = 3) {
  const tagsPayload: Array<string> = [];
  for (let i = 0, limi = numberOfTags; i < limi; i++) {
    const TAGS_INDEX = generateRandomNumberInLimit(0, TAGS.length);
    tagsPayload.push(TAGS[TAGS_INDEX]);
  };
  return (tagsPayload);
}


const prisma = new PrismaClient();
const MIN_USERS = 20;
const MAX_USERS = 50;
const MIN_POSTS_PER_USER = 2;
const MAX_POSTS_PER_USER = 10;
const RANDOM_NUMBER_OF_USERS = generateRandomNumberInLimit(MIN_USERS, MAX_USERS);
const DEV_USER_ID = '73bcb53e-b4a3-4e02-8243-82c22da14fe8';

async function seed() {
  const hashedSimplePassword = await argon2.hash('password');
  const createUserPromises: Array<Prisma.Prisma__UserClient<any>> = [];

  const amountOfUsers = await prisma.user.count();
  const devUserExists = await prisma.user.findUnique({
    where: {
      id: DEV_USER_ID
    }
  });
  if (devUserExists !== null) {
    console.log('💻 Dev account has already been seeded 💻');
  } else {
    console.log('💻 Creating dev account 💻');
    createUserPromises.push(prisma.user.create({
      data: {
        id: DEV_USER_ID,
        username: 'sammy',
        displayUsername: 'sammy',
        name: 'sammy',
        email: 'sammy@seed.local',
        emailVerified: true,
        location: 'Colorado',
        favoriteBikes: ['1991 Trek Single Track 990'],
        accounts: {
          create: {
            id: uuid(),
            accountId: DEV_USER_ID,
            providerId: 'credential',
            password: hashedSimplePassword,
          },
        },
      }
    }));
  };

  if (amountOfUsers >= MIN_USERS) {
    console.log(`🌳 Users have already been seeded 🌳, Number of users: ${amountOfUsers}`);
  } else {

    await prisma.tag.createMany({
      data: TAGS.map((name) => ({ name }))
    });

    for (let i = 0, limi = RANDOM_NUMBER_OF_USERS; i < limi; i++) {
      const RANDOM_NUMBER_OF_POSTS = generateRandomNumberInLimit(MIN_POSTS_PER_USER, MAX_POSTS_PER_USER);
      const tagsPayload = createRandomNumberOfTags(generateRandomNumberInLimit(1, 6));
      const postsPayloadArray = [];
      for (let j = 0, limj = RANDOM_NUMBER_OF_POSTS; j < limj; j++) {
        postsPayloadArray.push({
          id: uuid(),
          title: faker.lorem.lines({ min: 1, max: 1 }),
          content: faker.lorem.lines({ min: 3, max: 20 }),
          createdAt: moment().subtract(Math.floor(Math.random() * 200), 'days').toISOString(),
          tags: {
            connectOrCreate: tagsPayload.map((name) => {
              return ({
                where: { name },
                create: { name },
              });
            })
          }
        });
      };
      const hashedSimplePassword = await argon2.hash('password');
      const newUserId = uuid();
      const newUsername = faker.internet.displayName();
      const createUserPromise = prisma.user.create({
        data: {
          id: newUserId,
          username: newUsername,
          displayUsername: newUsername,
          name: newUsername,
          email: faker.internet.email({ firstName: newUsername }),
          emailVerified: true,
          favoriteBikes: new Array(generateRandomNumberInLimit()).fill(null).map(() => faker.vehicle.bicycle()),
          location: faker.location.state(),
          posts: { create: postsPayloadArray },
          accounts: {
            create: {
              id: uuid(),
              accountId: newUserId,
              providerId: 'credential',
              password: hashedSimplePassword,
            },
          },
        }
      });

      createUserPromises.push(createUserPromise);
    }
    const users: Array<User> = await Promise.all(createUserPromises);

    console.log(`🌱 ${users.length} Users seeded with dev account 🌱`);

    const posts: Array<Post> = await prisma.post.findMany();

    const commentPromises = [];
    const replyPromises = [];
    const childReplyPromises = [];
    for (let i = 0, limi = posts.length; i < limi; i++) {
      const commentsPerPost = generateRandomNumberInLimit(3, 15);
      const post = posts[i];

      for (let j = 0, limj = commentsPerPost; j < limj; j++) {
        const userIndex = generateRandomNumberInLimit(0, users.length - 1);
        const parentCommentId = uuid();
        const commentPromise = prisma.comment.create({
          data: {
            content: faker.lorem.sentences({ min: 1, max: 5 }),
            id: parentCommentId,
            authorId: users[userIndex].id,
            postId: post.id,
            createdAt: moment().subtract(Math.floor(Math.random() * 200), 'days').toISOString(),
          }
        });
        commentPromises.push(commentPromise);

        const repliesPerComment = generateRandomNumberInLimit(0, 5);
        for (let k = 0, limk = repliesPerComment; k < limk; k++) {
          const userIndex = generateRandomNumberInLimit(0, users.length - 1);
          const replyId = uuid();
          const replyPromise = prisma.comment.create({
            data: {
              content: faker.lorem.sentences({ min: 1, max: 5 }),
              id: replyId,
              authorId: users[userIndex].id,
              postId: post.id,
              parentCommentId,
              createdAt: moment().subtract(Math.floor(Math.random() * 200), 'days').toISOString(),

            }
          });
          replyPromises.push(replyPromise);

          // Loop again while creating a reply to create x number of child replies
          const repliesPerReply = generateRandomNumberInLimit(0, 2);
          for (let l = 0, liml = repliesPerReply; l < liml; l++) {
            const userIndex = generateRandomNumberInLimit(0, users.length - 1);
            const childReplyPromise = prisma.comment.create({
              data: {
                content: faker.lorem.sentences({ min: 1, max: 5 }),
                id: uuid(),
                authorId: users[userIndex].id,
                postId: post.id,
                parentCommentId: replyId,
                createdAt: moment().subtract(Math.floor(Math.random() * 200), 'days').toISOString(),

              }
            });
            childReplyPromises.push(childReplyPromise);
          }
        }
      }
    }

    const comments = await Promise.all(commentPromises);
    const replies = await Promise.all(replyPromises);
    const childReplies = await Promise.all(childReplyPromises);
    console.log(`🌱 ${comments.length} Comments have been seeded 🌱`);
    console.log(`🌱 ${replies.length} Replies have been seeded 🌱`);
    console.log(`🌱 ${childReplies.length} Child Replies have been seeded 🌱`);
  }
};
if (process.env.NODE_ENV !== 'production') {
  seed()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e: any) => {
      console.error('❌ Unable to seed database ❌', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
