import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';

const prisma = new PrismaClient();

const batchUsers = async (userIds: readonly string[]) => {
  const users = await prisma.user.findMany({
    where: {
      id: { in: [...userIds] },
    },
  });
  const userMap = new Map(users.map((user) => [user.id, user]));
  return userIds.map((id) => userMap.get(id) || null);
};

const batchProfiles = async (userIds: readonly string[]) => {
  const profiles = await prisma.profile.findMany({
    where: {
      userId: { in: [...userIds] },
    },
  });
  const profileMap = new Map(profiles.map((profile) => [profile.userId, profile]));
  return userIds.map((id) => profileMap.get(id) || null);
};

const batchMemberTypes = async (typeIds: readonly string[]) => {
  const memberTypes = await prisma.memberType.findMany({
    where: {
      id: { in: [...typeIds] },
    },
  });
  const memberTypeMap = new Map(memberTypes.map((type) => [type.id, type]));
  return typeIds.map((id) => memberTypeMap.get(id) || null);
};

export const userLoader = new DataLoader<string, User | null>(batchUsers);
export const profileLoader = new DataLoader<string, Profile | null>(batchProfiles);
export const memberTypeLoader = new DataLoader<string, MemberType | null>(
  batchMemberTypes,
);

const batchPosts = async (userIds: readonly string[]): Promise<Post[][]> => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: { in: [...userIds] },
    },
  });

  const postsMap = new Map<string, Post[]>();

  for (const post of posts) {
    if (!postsMap.has(post.authorId)) {
      postsMap.set(post.authorId, []);
    }
    postsMap.get(post.authorId)!.push(post);
  }

  return userIds.map((userId) => postsMap.get(userId) || []);
};

export const postLoader = new DataLoader<string, Post[]>(batchPosts);
