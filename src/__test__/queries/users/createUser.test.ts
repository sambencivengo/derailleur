import { v4 as uuid } from 'uuid';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { checkErrorResponse } from '~/__test__/utils';
import { createUser } from '../../../queries/users/createUser';
import { CreateUserPayload } from '~/types';
import prisma from '~prisma/prisma';

const testUsername = 'sammy_single_track';
const testUsernames = [testUsername, 'testUsername_01', 'testUsername_02'] as const;

describe('Create User Query', () => {
  const now = new Date();
  const testUserId = uuid();
  const testPassword = 'testPassword1234!';
  const passwordOnlyPayload = {
    password: testPassword
  };
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { username: { in: [...testUsernames] } } });
  });

  it('Successfully creates a new user with all fields', async () => {
    const testFavBike = "1991 Trek Single Track 990";
    const testLocation = 'Fort Collins, CO';
    const testCreateUser: CreateUserPayload = {
      username: testUsername,
      favoriteBikes: [testFavBike],
      location: testLocation,
      password: testPassword
    };
    const response = await createUser(testCreateUser, testUserId);
    const result = response.result!;
    const { errors } = response;
    if (result) createdUserIds.push(result.id);
    expect(response).toBeTruthy();
    expect(result.username).toBe(testUsername);
    expect(result.id).toBe(testUserId);
    expect(result.favoriteBikes).toEqual([testFavBike]);
    expect(result.location).toBe(testLocation);
    expect(result.createdAt.getTime()).toBeGreaterThanOrEqual(now.getTime());
    expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(now.getTime());
    checkErrorResponse(errors);
  });

  it('Successfully creates a new user with location and favorite bike undefined', async () => {
    const username = 'testUsername_01';
    const response = await createUser({ username, ...passwordOnlyPayload });
    const result = response.result!;
    const errors = response.errors;
    if (result) createdUserIds.push(result.id);
    expect(response).toBeTruthy();
    expect(result.username).toBe(username);
    expect(result.favoriteBikes).toEqual([]);
    expect(result.location).toBeNull();
    expect(result.createdAt.getTime()).toBeGreaterThanOrEqual(now.getTime());
    expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(now.getTime());
    checkErrorResponse(errors);
  });

  it('Fails to create a user due to username conflict', async () => {
    const response = await createUser({ username: testUsername, ...passwordOnlyPayload });
    const { errors, result } = response;
    expect(response).toBeTruthy();
    expect(result).toBeNull();
    checkErrorResponse(errors, true);
  });

  it('Fails to create a user due to username being greater than 30 characters', async () => {
    const username = 'x'.repeat(31);
    const response = await createUser({ username, ...passwordOnlyPayload });
    const { result, errors } = response;
    expect(response).toBeTruthy();
    expect(result).toBeNull();
    expect(errors).not.toBeNull();
    expect(Array.isArray(errors)).toBe(true);
    checkErrorResponse(errors, true);
  });

  it('Fails to create a user due to being supplied a non-unique uuid()', async () => {
    const username = 'testUsername_02';
    const response = await createUser({ username, ...passwordOnlyPayload }, testUserId);
    const { result, errors } = response;
    expect(response).toBeTruthy();
    expect(result).toBeNull();
    checkErrorResponse(errors, true);
  });

  afterAll(async () => {
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }
  });
});
