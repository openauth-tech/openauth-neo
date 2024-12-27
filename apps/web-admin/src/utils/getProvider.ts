export function getEthereumProvider() {
  if ('ethereum' in window) {
    const anyWindow: any = window
    return anyWindow.ethereum
  }
}
