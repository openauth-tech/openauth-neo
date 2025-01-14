import { Type } from '@fastify/type-provider-typebox'
import type { FastifyInstance } from 'fastify'

import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../models/typebox'
import { prisma } from '../../../../utils/prisma'
import { RedisTools } from '../../../../utils/redis'
import { ERROR400_SCHEMA } from '../../../../utils/schema'
import { generateAuthUrl } from '../../../../utils/tiktok'

const schema = {
  tags: ['Auth'],
  summary: 'TikTok oauth',
  params: Type.Object({
    appId: Type.String(),
  }),
  querystring: Type.Object({
    endpoint: Type.String(),
    redirectUrl: Type.String(),
  }),
  response: {
    400: ERROR400_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { appId } = request.params
  const { endpoint, redirectUrl } = request.query
  const app = await prisma.app.findUnique({ where: { id: appId } })
  if (!app?.tiktokClientKey || !app?.tiktokClientSecret) {
    return reply.status(400).send({ message: 'The TikTok client key is not set.' })
  }

  const redirectUri = `${endpoint}/auth/${appId}/tiktok/callback`
  const { url, csrfState, codeVerifier } = generateAuthUrl({ clientKey: app.tiktokClientKey, redirectUri })

  reply.setCookie('csrfState', csrfState, { maxAge: 60_000 })
  await RedisTools.saveTiktokAuth(csrfState, { appId, codeVerifier, redirectUri, redirectUrl })

  reply.redirect(url)
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/oauth',
    schema,
    handler,
  })
}
