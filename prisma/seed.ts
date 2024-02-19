import { Prisma, PrismaClient } from "@prisma/client";
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import moment from "moment";


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

  async function checkForAndCreateDevUser() {
    if (devUserExists !== null) {
      console.log('💻 Dev account has already been seeded 💻');
    } else {
      console.log('💻 Creating dev account 💻');
      await prisma.user.create({
        data: {
          hashedPassword: hashedSimplePassword,
          id: DEV_USER_ID,
          username: 'sammy',
          location: 'Colorado',
          favoriteBike: '1991 Trek Single Track 990',
        }
      });
    };
  }

  const amountOfUsers = await prisma.user.count();
  const devUserExists = await prisma.user.findUnique({
    where: {
      id: DEV_USER_ID
    }
  });
  await checkForAndCreateDevUser();
  if (amountOfUsers >= MIN_USERS) {
    console.log(`🌳 Users have already been seeded 🌳, Number of users: ${amountOfUsers}`);
  } else {
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

      const createUserPromise = prisma.user.create({
        data: {
          id: uuid(),
          username: faker.internet.displayName(),
          favoriteBike: faker.vehicle.bicycle(),
          hashedPassword: hashedSimplePassword,
          location: faker.location.state(),
          posts: { create: postsPayloadArray },
        }
      });

      createUserPromises.push(createUserPromise);
    }

    await Promise.all(createUserPromises);
    console.log(`🌱 ${createUserPromises.length} Users seeded with dev account🌱`);
  }
};
seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: any) => {
    console.error('❌ Unable to seed database ❌', e);
    await prisma.$disconnect();
    process.exit(1);
  });