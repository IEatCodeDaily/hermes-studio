import { beforeEach, describe, expect, it, vi } from 'vitest'

const readConfigYamlForProfileMock = vi.fn()

vi.mock('../../packages/server/src/services/config-helpers', () => ({
  readConfigYamlForProfile: readConfigYamlForProfileMock,
}))

describe('run chat model config', () => {
  beforeEach(() => {
    readConfigYamlForProfileMock.mockReset()
    readConfigYamlForProfileMock.mockResolvedValue({
      model: { default: 'default-model', provider: 'default-provider' },
    })
  })

  it('uses the profile default for a new bridge session', async () => {
    const { resolveBridgeRunModelConfig } = await import('../../packages/server/src/services/hermes/run-chat/model-config')

    const result = await resolveBridgeRunModelConfig({
      profile: 'default',
      requestedModel: 'gpt-5.2',
      requestedProvider: 'openai',
      modelGroups: [{ provider: 'openai', models: ['gpt-5.2'] }],
    })

    expect(result).toEqual({ model: 'default-model', provider: 'default-provider' })
    expect(readConfigYamlForProfileMock).toHaveBeenCalledWith('default')
  })

  it('keeps an existing session model ahead of a requested model', async () => {
    const { resolveBridgeRunModelConfig } = await import('../../packages/server/src/services/hermes/run-chat/model-config')

    const result = await resolveBridgeRunModelConfig({
      profile: 'default',
      sessionModel: 'claude-sonnet-4.5',
      sessionProvider: 'anthropic',
      requestedModel: 'gpt-5.2',
      requestedProvider: 'openai',
      modelGroups: [
        { provider: 'anthropic', models: ['claude-sonnet-4.5'] },
        { provider: 'openai', models: ['gpt-5.2'] },
      ],
    })

    expect(result).toEqual({ model: 'claude-sonnet-4.5', provider: 'anthropic' })
    expect(readConfigYamlForProfileMock).not.toHaveBeenCalled()
  })

  it('falls back to profile default when only a requested model is available', async () => {
    const { resolveBridgeRunModelConfig } = await import('../../packages/server/src/services/hermes/run-chat/model-config')

    const result = await resolveBridgeRunModelConfig({
      profile: 'default',
      requestedModel: 'gpt-5.5',
      requestedProvider: 'custom',
    })

    expect(result).toEqual({ model: 'default-model', provider: 'default-provider' })
    expect(readConfigYamlForProfileMock).toHaveBeenCalledWith('default')
  })

  it('maps a session Claude OAuth provider to the Anthropic runtime provider', async () => {
    const { resolveBridgeRunModelConfig } = await import('../../packages/server/src/services/hermes/run-chat/model-config')

    const result = await resolveBridgeRunModelConfig({
      profile: 'default',
      sessionModel: 'claude-sonnet-4-6',
      sessionProvider: 'claude-oauth',
      modelGroups: [{ provider: 'claude-oauth', models: ['claude-sonnet-4-6'] }],
    })

    expect(result).toEqual({ model: 'claude-sonnet-4-6', provider: 'anthropic' })
    expect(readConfigYamlForProfileMock).not.toHaveBeenCalled()
  })

  it('keeps an explicit session model when no model group list is available', async () => {
    const { resolveBridgeRunModelConfig } = await import('../../packages/server/src/services/hermes/run-chat/model-config')

    const result = await resolveBridgeRunModelConfig({
      profile: 'default',
      sessionModel: 'gpt-5.5',
      sessionProvider: 'custom',
    })

    expect(result).toEqual({ model: 'gpt-5.5', provider: 'custom' })
    expect(readConfigYamlForProfileMock).not.toHaveBeenCalled()
  })

  it('falls back to the profile default when the candidate model is unavailable', async () => {
    const { resolveBridgeRunModelConfig } = await import('../../packages/server/src/services/hermes/run-chat/model-config')

    const result = await resolveBridgeRunModelConfig({
      profile: 'default',
      requestedModel: 'missing-model',
      requestedProvider: 'openai',
      modelGroups: [{ provider: 'openai', models: ['gpt-5.2'] }],
    })

    expect(result).toEqual({ model: 'default-model', provider: 'default-provider' })
    expect(readConfigYamlForProfileMock).toHaveBeenCalledWith('default')
  })
})
