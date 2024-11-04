import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType } from 'graphql';

import { MemberTypeId } from '../member-types/schemas.js';
import {
  MemberIdType,
  MemberType,
  MemberTypes,
  Post,
  Posts,
  Profile,
  Profiles,
  User,
  Users,
} from './types.js';
import { UUIDType } from './types/uuid.js';

export const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: MemberTypes,
      resolve: async (_, __, context: { prisma: PrismaClient }) => {
        return context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberIdType } },
      resolve: async (
        _,
        { id }: { id: MemberTypeId },
        context: { prisma: PrismaClient },
      ) => {
        return context.prisma.memberType.findUnique({
          where: { id },
        });
      },
    },
    posts: {
      type: Posts,
      resolve: async (_, __, context: { prisma: PrismaClient }) => {
        return context.prisma.post.findMany();
      },
    },
    post: {
      type: Post,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, context: { prisma: PrismaClient }) => {
        return context.prisma.post.findUnique({
          where: { id },
        });
      },
    },
    users: {
      type: Users,
      resolve: async (_, __, context: { prisma: PrismaClient }) => {
        return context.prisma.user.findMany();
      },
    },
    user: {
      type: User,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, context: { prisma: PrismaClient }) => {
        return context.prisma.user.findUnique({
          where: { id },
        });
      },
    },
    profiles: {
      type: Profiles,
      resolve: async (_, __, context: { prisma: PrismaClient }) => {
        return context.prisma.profile.findMany();
      },
    },
    profile: {
      type: Profile,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, context: { prisma: PrismaClient }) => {
        return context.prisma.profile.findUnique({
          where: { id },
        });
      },
    },
  },
});
