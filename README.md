# dazaar-scatter-pay

Pay for Dazaar feeds using Scatter

```js
const DazaarPay = require('dazaar-scatter-pay')

// pass in an array of dazaard card entries
const payments = [{ currency: 'EOS', payTo: 'dazaartest22' }]
const sellerKey = Buffer.from('dazaar-seller-key', 'hex')

const pay = new DazaarPay(payments, sellerKey)

for (const provider of pay.supported) {
  console.log('Supports', provider.name)
}

// Will call out to Scatter to request the purchase
pay.supported[0].buy(buyerKey, '1.0000 EOS', function (err) {
  console.log('bought for 1 EOS?', err)
})
```

## API

#### `pay = new DazaarScatterPay(payments, sellerKey)`

Make a new instance.

`payments` should be an array of payment objects, usually retrieved using a Dazaar card.
`sellerKey` should be the Dazaar sellers key as a buffer.

#### `pay.supported`

A list of supported Payment objects corresponding to your payments input.

#### `payment = pay.match(paymentEntry)`

Match a specific entry from your payments input to a provider. If not supported null is returned.

#### `payment.buy(buyerKey, amount, cb)`

Purchase Dazaar time for the given amount. `buyerKey` should be the buyer's key as a buffer.
