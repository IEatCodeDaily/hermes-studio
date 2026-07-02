import { readConfigYamlForProfile } from '../../config-helpers'

export type RunModelGroup = { provider: string; models: string[] }

function runtimeProvider(provider: string): string {
  return provider === 'claude-oauth' ? 'anthropic' : provider
}

async function resolveDefaultModelConfig(profile: string): Promise<{ model: string; provider: string }> {
  try {
    const config = await readConfigYamlForProfile(profile)
    const modelConfig = config?.model
    const model = typeof modelConfig === 'string'
      ? modelConfig.trim()
      : String(modelConfig?.default || '').trim()
    const provider = typeof modelConfig === 'object'
      ? String(modelConfig?.provider || '').trim()
      : ''
    return { model, provider: runtimeProvider(provider) }
  } catch {
    return { model: '', provider: '' }
  }
}

function hasModelInGroups(groups: RunModelGroup[] | undefined, provider: string, model: string): boolean {
  if (!groups?.length || !provider || !model) return false
  const group = groups.find(item => item.provider === provider)
  return Array.isArray(group?.models) && group.models.includes(model)
}

export async function resolveBridgeRunModelConfig(options: {
  profile: string
  sessionModel?: string | null
  sessionProvider?: string | null
  requestedModel?: string | null
  requestedProvider?: string | null
  modelGroups?: RunModelGroup[]
}): Promise<{ model: string; provider: string }> {
  const sessionModel = String(options.sessionModel || '').trim()
  const sessionProvider = String(options.sessionProvider || '').trim()
  const requestedModel = String(options.requestedModel || '').trim()
  const requestedProvider = String(options.requestedProvider || '').trim()

  // An explicit session-level model selection always wins. The user deliberately
  // picked this model; honour it even if it isn't listed in the provider catalog
  // (common for Z.AI / GLM, whose /v1/models endpoint omits several models).
  if (sessionModel && sessionProvider) {
    return { model: sessionModel, provider: runtimeProvider(sessionProvider) }
  }

  // No session model — fall back to the config default rather than guessing,
  // so new sessions start on the configured default instead of a stale value.
  return resolveDefaultModelConfig(options.profile)
}
