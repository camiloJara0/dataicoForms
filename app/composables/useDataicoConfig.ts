export function useDataicoConfig() {
  const token = useState<string>('dataico-token', () => '')
  const dataicoAccountId = useState<string>('dataico-account-id', () => '')

  function loadFromStorage() {
    if (import.meta.client) {
      token.value = localStorage.getItem('token') || ''
      dataicoAccountId.value = localStorage.getItem('dataico_account_id') || ''
    }
  }

  function saveToStorage() {
    if (import.meta.client) {
      localStorage.setItem('token', token.value)
      localStorage.setItem('dataico_account_id', dataicoAccountId.value)
    }
  }

  return { token, dataicoAccountId, loadFromStorage, saveToStorage }
}
