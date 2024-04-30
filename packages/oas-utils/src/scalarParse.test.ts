import { describe, expect, test } from 'vitest'
import YAML from 'yaml'

import { parse } from './parseOld'
import { scalarParse } from './scalarParse'

describe('Translates open api spec to data object for rendering', () => {
  test('Parse openapi 3 spec', async () => {
    const specification = {
      openapi: '3.0.0',
      info: { title: 'Example' },
      paths: {},
    }
    const oldresult = await parse(specification)
    const result = await scalarParse(specification)

    expect(result).toStrictEqual(oldresult)
  })

  test('Parse openapi 3.1 spec with webhooks', async () => {
    const content = await fetch('https://cdn.scalar.com/spec/mega.yaml').then(
      (res) => res.text(),
    )

    const specification = YAML.parse(content)

    const oldresult = await parse(specification)
    const result = await scalarParse(specification)

    expect(result.tags).toStrictEqual(oldresult.tags)
    expect(result.info).toStrictEqual(oldresult.info)
    // not the same because before the info object was not correct
    expect(result.webhooks).not.toStrictEqual(oldresult.webhooks)
    expect(result.components).toStrictEqual(oldresult.components)
    expect(result.paths).toStrictEqual(oldresult.paths)
    // expect(result).toStrictEqual(oldresult)
  })

  test('Parse openapi 3.1 spec webflow', async () => {
    const content = await fetch(
      'https://cdn.scalar.com/spec/webflowcom.yaml',
    ).then((res) => res.text())

    const specification = YAML.parse(content)

    const oldresult = await parse(specification)
    const result = await scalarParse(specification)

    expect(result.tags).toStrictEqual(oldresult.tags)
    expect(result.info).toStrictEqual(oldresult.info)
    expect(result.webhooks).toStrictEqual(oldresult.webhooks)
    expect(result.components).toStrictEqual(oldresult.components)
    expect(result.paths).toStrictEqual(oldresult.paths)
    // expect(result).toStrictEqual(oldresult)
  })

  test('Parse swagger 2.0 spec bbc uk', async () => {
    const content = await fetch(
      'https://cdn.scalar.com/spec/bbccouk.yaml',
    ).then((res) => res.text())
    const specification = YAML.parse(content)

    const oldresult = await parse(specification)
    const result = await scalarParse(specification)

    expect(result.tags).toStrictEqual(oldresult.tags)
    expect(result.info).toStrictEqual(oldresult.info)
    expect(result.webhooks).toStrictEqual(oldresult.webhooks)
    expect(result.components).toStrictEqual(oldresult.components)
    expect(result.paths).toStrictEqual(oldresult.paths)
    expect(result).toStrictEqual(oldresult)
  })
})
