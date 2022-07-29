const deploy = require("./deploy")

deploy({ MAINNET: true })
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
