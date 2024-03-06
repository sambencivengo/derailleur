import { mockUser_00 } from "~/__test__/mock/users/mockUser";


export const mockPost_00 = {
  id: 'testPostId_00',
  authorId: mockUser_00.id,
  published: false,
  title: "Looking for bikepacking routes around Colorado's front range",
  content: "Any help would be greatly appreciated! Looking to get out on the trails ASAP!",
  createdAt: new Date('2023-09-19'),
  updatedAt: new Date('2023-09-19'),
  tags: []
};