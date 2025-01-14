import type { FastifyInstance } from 'fastify'

import type { HuggingfaceRedirectQueryParams } from '../../../../models/huggingface'
import { TypeHuggingfaceRedirectQueryParams } from '../../../../models/huggingface'
import type { FastifyReplyTypebox, FastifyRequestTypebox } from '../../../../models/typebox'
import { getAccessToken, HuggingfaceCookieNames } from '../../../../utils/huggingface'
import { prisma } from '../../../../utils/prisma'
import { ERROR500_SCHEMA } from '../../../../utils/schema'

const schema = {
  tags: ['Auth'],
  summary: 'Huggingface callback',
  queryString: TypeHuggingfaceRedirectQueryParams,
  response: {
    500: ERROR500_SCHEMA,
  },
}

async function handler(request: FastifyRequestTypebox<typeof schema>, reply: FastifyReplyTypebox<typeof schema>) {
  const { error, code } = request.query as HuggingfaceRedirectQueryParams
  const appId = request.cookies[HuggingfaceCookieNames.AppId]
  const redirectUri = request.cookies[HuggingfaceCookieNames.RedirectUri]
  const redirectUrl = request.cookies[HuggingfaceCookieNames.RedirectUrl]

  if (!appId || !redirectUrl || !redirectUri) {
    return reply.status(500).send({ message: 'Missing cookies' })
  }

  const url = new URL(redirectUrl)
  const searchParams = new URLSearchParams(url.search)

  if (error) {
    searchParams.set('error', error)
    return reply.redirect(`${url.origin}${url.pathname}?${searchParams.toString()}`)
  }

  const app = await prisma.app.findUnique({ where: { id: appId } })
  if (!app?.huggingfaceClientId || !app?.huggingfaceAppSecret) {
    return reply.status(500).send({ message: 'Huggingface client id is not set' })
  }

  searchParams.append('auth_type', 'openauth_huggingface')

  try {
    const { access_token, token_type } = await getAccessToken({
      code,
      client_id: app.huggingfaceClientId,
      client_secret: app.huggingfaceAppSecret,
      redirect_uri: redirectUri,
    })
    searchParams.set('access_token', access_token)
    searchParams.set('token_type', token_type)
  } catch (error: any) {
    searchParams.set('error', error.message ?? error.name ?? 'Unknown error')
  }
  reply.redirect(`${url.origin}${url.pathname}?${searchParams.toString()}`)
}

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/callback',
    schema,
    handler,
  })
}
