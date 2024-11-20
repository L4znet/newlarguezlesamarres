// seed/auth.seed.js
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

let createdUsers = []

const seedAuth = async () => {
     try {
          const userData = [
               { email: "test1@example.com", password: "password123" },
               { email: "test2@example.com", password: "password456" },
          ]

          for (const user of userData) {
               const { data, error } = await supabase.auth.admin.createUser({
                    email: user.email,
                    password: user.password,
                    email_confirm: true,
               })

               if (error) {
                    console.error(`Erreur lors de la création de l'utilisateur ${user.email} :`, error)
               } else {
                    console.log(`Utilisateur ${user.email} créé avec succès !`)
                    createdUsers.push(data.id)
               }
          }
     } catch (err) {
          console.error("Erreur lors du seeding des utilisateurs :", err)
     }
}

const cleanupAuth = async () => {
     try {
          for (const userId of createdUsers) {
               const { error } = await supabase.auth.admin.deleteUser(userId)
               if (error) {
                    console.error(`Erreur lors de la suppression de l'utilisateur ${userId} :`, error)
               } else {
                    console.log(`Utilisateur ${userId} supprimé avec succès.`)
               }
          }
     } catch (err) {
          console.error("Erreur lors du nettoyage des utilisateurs :", err)
     }
}

module.exports = { seedAuth, cleanupAuth }
