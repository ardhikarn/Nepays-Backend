const midtransClient = require('midtrans-client')

module.exports = {
  createPayment: (id_topup, nominal) => {
    return new Promise((resolve, reject) => {
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: 'YOUR_SERVER_KEY',
        clientKey: 'YOUR_CLIENT_KEY'
      })
      const parameter = {
        transaction_details: {
          order_id: id_topup,
          gross_amount: nominal
        },
        credit_card: {
          secure: true
        }
      }

      snap.createTransaction(parameter)
        .then((transaction) => {
          console.log(transaction)
          resolve(transaction.redirect_url)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
    })
  }
}
