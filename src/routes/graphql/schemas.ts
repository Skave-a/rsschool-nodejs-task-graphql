import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';

import { getRootMutation } from './mutations.js';
import { rootQuery } from './queries.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const prisma = new PrismaClient();

const rootMutation = getRootMutation(prisma);

export const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});
