import { providerError } from './transport'

describe('providerError', () => {
  test('classifies HTTP 503 as PROVIDER_UNFUNDED', () => {
    const error = providerError({ error: { type: 'overloaded_error', message: 'Service unavailable' } }, 503)
    expect(error.code).toBe('PROVIDER_UNFUNDED')
    expect(error.message).toBe('Service unavailable')
  })

  test('classifies type=overloaded_error as PROVIDER_UNFUNDED', () => {
    const error = providerError({ error: { type: 'overloaded_error', message: 'Overloaded' } }, undefined)
    expect(error.code).toBe('PROVIDER_UNFUNDED')
    expect(error.message).toBe('Overloaded')
  })

  test('preserves other error classifications', () => {
    expect(providerError({ error: { type: 'api_error', message: 'Server error' } }, 500).code).toBe('SERVER')
    expect(providerError({ error: { type: 'rate_limit_error', message: 'Too many requests' } }, 429).code).toBe('RATE_LIMIT')
    expect(providerError({ error: { type: 'invalid_request_error', message: 'Bad request' } }, 400).code).toBe('INVALID_REQUEST')
  })
})
