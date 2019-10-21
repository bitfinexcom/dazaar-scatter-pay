const providers = [
  require('./providers/eos'),
  require('./providers/eos-testnet')
]

module.exports = class DazaarScatterPay {
  constructor (payments, seller) {
    this.seller = seller
    this.payments = payments
    this.providers = match(payments, seller)
    this.supported = this.providers.filter(exists)
  }

  match (pay) {
    const i = this.payments.indexOf(pay)
    if (i === -1) return null
    return this.providers[i]
  }
}

function exists (x) {
  return x
}

function match (payments, seller) {
  if (!payments) return []
  if (!Array.isArray(payments)) payments = [payments]

  const result = []

  for (const pay of payments) {
    const provider = findSupported(pay, seller)
    result.push(provider)
  }

  return result
}

function findSupported (pay, seller) {
  for (const P of providers) {
    if (P.supports(pay)) return new P(pay, seller)
  }

  return null
}
