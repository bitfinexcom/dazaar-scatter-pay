require('isomorphic-fetch')

const metadata = require('../metadata')
const ScatterJS = require('@scatterjs/core').default
const ScatterEOS = require('@scatterjs/eosjs2').default
const { JsonRpc, Api } = require('eosjs')
const { TextEncoder, TextDecoder } = require('util')

ScatterJS.plugins(new ScatterEOS())

module.exports = class DazaarEOSPay {
  constructor (pay, seller, opts = {}) {
    this.payment = pay
    this.name = 'EOS'
    this.seller = seller
    this.chainId = opts.chainId || 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    this.rpc = opts.rpc || 'api.eosnewyork.io'
  }

  static supports (payment) {
    return payment.currency === 'EOS'
  }

  buy (buyer, amount, cb) {
    const memo = metadata(this.seller, buyer)
    payEOS(this.payment.payTo, amount, memo, this.chainId, this.rpc, cb)
  }
}

function payEOS (destination, amount, memo, chainId, host, cb) {
  const network = ScatterJS.Network.fromJson({
    blockchain: 'eos',
    chainId,
    host,
    port: 443,
    protocol: 'https'
  })

  const rpc = new JsonRpc(network.fullhost())
  let once = false

  ScatterJS.connect('Dazaar', { network }).catch(done).then(connected => {
    if (!connected) return done(new Error('Scatter does not seem to be running'))

    const eos = ScatterJS.eos(network, Api, { rpc, textEncoder: new TextEncoder(), textDecoder: new TextDecoder() })

    ScatterJS.login().catch(done).then(id => {
      if (!id) return done(new Error('No identity available'))

      const account = ScatterJS.account('eos')

      eos.transact({
        actions: [{
          account: 'eosio.token',
          name: 'transfer',
          authorization: [{
            actor: account.name,
            permission: account.authority
          }],
          data: {
            from: account.name,
            to: destination,
            quantity: amount,
            memo: memo
          }
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30
      }).catch(done).then(res => {
        ScatterJS.logout().catch(done).then(success => {
          if (success) return done(null, res)
          done(new Error('Could not logout of Scatter'))
        })
      })
    })
  })

  function done (err, val) {
    if (once) return
    once = true
    process.nextTick(cb, err || null, val)
  }
}
