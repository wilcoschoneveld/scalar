import type { OpenAPIV3 } from '@scalar/openapi-types'

import {
  processSecurityRequirements,
  processSecuritySchemes,
} from './helpers/authHelpers'
import { processItem } from './helpers/itemHelpers'
import { parseServers } from './helpers/serverHelpers'
import type { PostmanCollection } from './types'

/**
 * Converts a Postman Collection to an OpenAPI 3.0.0 document.
 * This function processes the collection's information, servers, authentication,
 * and items to create a corresponding OpenAPI structure.
 */
export function convert(collection: PostmanCollection): OpenAPIV3.Document {
  const openapi: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
      title: collection.info.name,
      description:
        typeof collection.info.description === 'string'
          ? collection.info.description
          : collection.info.description?.content || '',
      version: '1.0.0',
    },
    servers: parseServers(collection),
    paths: {},
  }

  if (collection.auth) {
    console.log('collection.auth', collection.auth)
    openapi.components = {
      securitySchemes: processSecuritySchemes(collection.auth),
    }
    openapi.security = processSecurityRequirements(collection.auth)
  }

  if (collection.item && Array.isArray(collection.item)) {
    collection.item.forEach((item) => {
      processItem(item, openapi, [], '')
    })
  }

  // Remove empty parameters arrays and handle empty request bodies
  if (openapi.paths) {
    Object.values(openapi.paths).forEach((path) => {
      if (path) {
        Object.values(path).forEach((method) => {
          if (method && 'parameters' in method) {
            if (method.parameters && method.parameters.length === 0) {
              delete method.parameters
            }
            if (method.requestBody && 'content' in method.requestBody) {
              const content = method.requestBody.content
              if (
                Object.keys(content).length === 0 ||
                (Object.keys(content).length === 1 &&
                  'text/plain' in content &&
                  (!content['text/plain'].schema ||
                    Object.keys(content['text/plain'].schema).length === 0))
              ) {
                delete method.requestBody
              }
            }
            if (!method.description) {
              method.description = ''
            }
          }
        })
      }
    })
  }

  return openapi
}
