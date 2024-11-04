import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import {
  memberTypeLoader,
  postLoader,
  profileLoader,
  userLoader,
} from './dataloaders.js';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const validationErrors = validate(schema, parse(req.body.query), [depthLimit(5)]);
      if (validationErrors.length) return { errors: validationErrors };

      const res = await graphql({
        schema,
        source: req.body.query,
        contextValue: {
          prisma,
          dataloaders: { userLoader, postLoader, profileLoader, memberTypeLoader },
        },
        variableValues: req.body.variables,
      });

      return res;
    },
  });
};

export default plugin;
