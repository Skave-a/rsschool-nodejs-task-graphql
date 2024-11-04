import { PrismaClient } from '@prisma/client';
import { Static } from '@sinclair/typebox';
import { GraphQLObjectType, GraphQLString } from 'graphql';

import { createPostSchema } from '../posts/schemas.js';
import { createProfileSchema } from '../profiles/schemas.js';
import { createUserSchema } from '../users/schemas.js';
import {
  ChangePostInput,
  ChangeProfileInput,
  ChangeUserInput,
  CreatePostInput,
  CreateProfileInput,
  CreateUserInput,
  Post,
  Profile,
  User,
} from './types.js';
import { UUIDType } from './types/uuid.js';

export function getUserMutations(prisma: PrismaClient) {
  return {
    createUser: {
      type: User,
      args: { dto: { type: CreateUserInput } },
      resolve: async (
        _,
        { dto }: { dto: Static<(typeof createUserSchema)['body']> },
        context: { prisma: PrismaClient },
      ) => {
        const createdUser = await context.prisma.user.create({
          data: dto,
        });
        return createdUser;
      },
    },
    changeUser: {
      type: User,
      args: { id: { type: UUIDType }, dto: { type: ChangeUserInput } },
      resolve: async (
        _,
        { dto, id }: { dto: Static<(typeof createUserSchema)['body']>; id: string },
        context: { prisma: PrismaClient },
      ) => {
        const updatedUser = await context.prisma.user.update({
          where: { id },
          data: dto,
        });
        return updatedUser;
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, context: { prisma: PrismaClient }) => {
        await context.prisma.user.delete({ where: { id } });
        return `User ${id} deleted`;
      },
    },
  };
}

export function getPostMutations(prisma: PrismaClient) {
  return {
    createPost: {
      type: Post,
      args: { dto: { type: CreatePostInput } },
      resolve: async (
        _,
        { dto }: { dto: Static<(typeof createPostSchema)['body']> },
        context: { prisma: PrismaClient },
      ) => {
        const createdUser = await context.prisma.post.create({
          data: dto,
        });
        return createdUser;
      },
    },
    changePost: {
      type: Post,
      args: { id: { type: UUIDType }, dto: { type: ChangePostInput } },
      resolve: async (
        _,
        { dto, id }: { dto: Static<(typeof createPostSchema)['body']>; id: string },
        context: { prisma: PrismaClient },
      ) => {
        const updatedUser = await context.prisma.post.update({
          where: { id },
          data: dto,
        });
        return updatedUser;
      },
    },
    deletePost: {
      type: GraphQLString,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, context: { prisma: PrismaClient }) => {
        await context.prisma.post.delete({ where: { id } });
        return `Post ${id} deleted`;
      },
    },
  };
}

export function getProfileMutations(prisma: PrismaClient) {
  return {
    createProfile: {
      type: Post,
      args: { dto: { type: CreateProfileInput } },
      resolve: async (
        _,
        { dto }: { dto: Static<(typeof createProfileSchema)['body']> },
        context: { prisma: PrismaClient },
      ) => {
        const createdUser = await context.prisma.profile.create({
          data: dto,
        });
        return createdUser;
      },
    },
    changeProfile: {
      type: Profile,
      args: { id: { type: UUIDType }, dto: { type: ChangeProfileInput } },
      resolve: async (
        _,
        { dto, id }: { dto: Static<(typeof createProfileSchema)['body']>; id: string },
        context: { prisma: PrismaClient },
      ) => {
        const updatedProfile = await context.prisma.profile.update({
          where: { id },
          data: dto,
        });
        return updatedProfile;
      },
    },
    deleteProfile: {
      type: GraphQLString,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, context: { prisma: PrismaClient }) => {
        await context.prisma.profile.delete({ where: { id } });
        return `Profile ${id} deleted`;
      },
    },
    subscribeTo: {
      type: User,
      args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        context: { prisma: PrismaClient },
      ) => {
        const subscribedToUser = await context.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId,
              },
            },
          },
        });
        return subscribedToUser;
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        context: { prisma: PrismaClient },
      ) => {
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
      },
    },
  };
}

export function getRootMutation(prisma: PrismaClient) {
  return new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...getUserMutations(prisma),
      ...getPostMutations(prisma),
      ...getProfileMutations(prisma),
    },
  });
}
