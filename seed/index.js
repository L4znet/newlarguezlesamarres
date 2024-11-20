const { seedAuth, cleanupAuth } = require("./auth.seed")

const seedDatabase = async () => {
     await seedAuth()
     //await seedProfile()
     //await seedProducts()
}

const cleanupDatabase = async () => {
     //await cleanupProducts()
     //await cleanupProfile()
     await cleanupAuth()
}

module.exports = { seedDatabase, cleanupDatabase }
