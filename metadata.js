// TODO: move to it's own repo?

module.exports = function (seller, buyer) {
  return 'dazaar: ' + seller.toString('hex') + ' ' + buyer.toString('hex')
}
