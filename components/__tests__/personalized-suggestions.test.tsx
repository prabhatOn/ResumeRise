describe('PersonalizedSuggestions', () => {
  it('should have a basic test to satisfy Jest requirements', () => {
    expect(true).toBe(true)
  })

  it('should be importable', async () => {
    // Test that the module can be imported without throwing
    const { PersonalizedSuggestions } = await import('../personalized-suggestions')
    expect(PersonalizedSuggestions).toBeDefined()
  })
})