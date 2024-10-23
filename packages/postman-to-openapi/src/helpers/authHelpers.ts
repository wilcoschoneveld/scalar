import type { OpenAPIV3 } from '@scalar/openapi-types'

import type { Auth, AuthAttribute } from '../types'

/**
 * Processes authentication information from a Postman collection and updates
 * the OpenAPI document with the corresponding security schemes.
 */
export function processSecuritySchemes(
  auth: Auth,
): OpenAPIV3.ComponentsObject['securitySchemes'] {
  const { securityScheme } = getAuthSchemeAndRequirement(auth)

  return securityScheme
}

/**
 * Processes authentication information from a Postman collection and updates
 * the OpenAPI document with the corresponding security requirements.
 */
export function processSecurityRequirements(
  auth: Auth,
  security?: OpenAPIV3.SecurityRequirementObject[],
): OpenAPIV3.SecurityRequirementObject[] {
  const { securityRequirement } = getAuthSchemeAndRequirement(auth)

  return updateSecurity(security, securityRequirement)
}

function getAuthSchemeAndRequirement(auth: Auth): {
  securityScheme: OpenAPIV3.ComponentsObject['securitySchemes']
  securityRequirement: OpenAPIV3.SecurityRequirementObject
} {
  if (auth.type === 'apikey') {
    return getApiKeyAuth(auth)
  } else if (auth.type === 'basic') {
    return getBasicAuth(auth)
  } else if (auth.type === 'bearer') {
    return getBearerAuth(auth)
  } else if (auth.type === 'oauth2') {
    return getOAuth2Auth(auth)
  } else {
    return {
      securityScheme: {},
      securityRequirement: {},
    }
  }
}

/**
 * Returns the security scheme and requirement for API Key authentication.
 * This is typically used for authentication via a key in the header, query, or cookie.
 */
function getApiKeyAuth(auth: Auth): {
  securityScheme: { [key: string]: OpenAPIV3.ApiKeySecurityScheme }
  securityRequirement: OpenAPIV3.SecurityRequirementObject
} {
  const apiKeyAuth: AuthAttribute | undefined = auth.apikey?.[0]
  const name = apiKeyAuth?.key || 'api_key'
  const inValue = (apiKeyAuth?.in as string)?.toLowerCase() || 'header'

  return {
    securityScheme: {
      apikeyAuth: {
        type: 'apiKey',
        name: name,
        in: inValue as 'query' | 'header' | 'cookie',
        description: apiKeyAuth?.description,
      },
    },
    securityRequirement: { apikeyAuth: [] },
  }
}

/**
 * Returns the security scheme and requirement for Basic authentication.
 * This uses the HTTP Basic authentication scheme, which involves sending a username and password.
 */
function getBasicAuth(auth: Auth): {
  securityScheme: { [key: string]: OpenAPIV3.HttpSecurityScheme }
  securityRequirement: OpenAPIV3.SecurityRequirementObject
} {
  const basicAuth: AuthAttribute | undefined = auth.basic?.[0]

  return {
    securityScheme: {
      basicAuth: {
        type: 'http',
        scheme: 'basic',
        description: basicAuth?.description,
      },
    },
    securityRequirement: { basicAuth: [] },
  }
}

/**
 * Returns the security scheme and requirement for Bearer token authentication.
 * This is typically used for JWT or OAuth 2.0 access tokens sent in the Authorization header.
 */
function getBearerAuth(auth: Auth): {
  securityScheme: { [key: string]: OpenAPIV3.HttpSecurityScheme }
  securityRequirement: OpenAPIV3.SecurityRequirementObject
} {
  const bearerAuth: AuthAttribute | undefined = auth.bearer?.[0]

  return {
    securityScheme: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: bearerAuth?.token?.type || 'JWT',
        description: bearerAuth?.description,
      },
    },
    securityRequirement: { bearerAuth: [] },
  }
}

/**
 * Returns the security scheme and requirement for OAuth 2.0 authentication.
 * This example uses the authorization code flow, but could be adapted for other OAuth 2.0 flows.
 */
function getOAuth2Auth(auth: Auth): {
  securityScheme: { [key: string]: OpenAPIV3.OAuth2SecurityScheme }
  securityRequirement: OpenAPIV3.SecurityRequirementObject
} {
  const oauth2Auth: AuthAttribute | undefined = auth.oauth2?.[0]
  const flows: OpenAPIV3.OAuth2SecurityScheme['flows'] = {}

  if (oauth2Auth?.grant_type === 'authorization_code') {
    flows.authorizationCode = {
      authorizationUrl:
        oauth2Auth?.authorization_url || 'https://example.com/oauth/authorize',
      tokenUrl:
        oauth2Auth?.access_token_url || 'https://example.com/oauth/token',
      scopes:
        oauth2Auth.scope?.reduce(
          (acc, scope) => ({ ...acc, [scope]: '' }),
          {},
        ) || {},
    }
  } else if (oauth2Auth?.grant_type === 'client_credentials') {
    flows.clientCredentials = {
      tokenUrl:
        oauth2Auth.access_token_url || 'https://example.com/oauth/token',
      scopes:
        oauth2Auth.scope?.reduce(
          (acc, scope) => ({ ...acc, [scope]: '' }),
          {},
        ) || {},
    }
  }

  return {
    securityScheme: {
      oauth2Auth: {
        type: 'oauth2',
        flows,
        description: oauth2Auth?.description,
      },
    },
    securityRequirement: { oauth2Auth: [] },
  }
}

function updateSecurity(
  existingSecurity: OpenAPIV3.SecurityRequirementObject[] | undefined,
  newRequirement: OpenAPIV3.SecurityRequirementObject,
): OpenAPIV3.SecurityRequirementObject[] {
  if (existingSecurity) {
    return [...existingSecurity, newRequirement]
  }
  return [newRequirement]
}
