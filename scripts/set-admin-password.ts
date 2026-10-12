/**
 * Sets the password of an admin user (and creates the user if it does not exist).
 * Run on the server:  npm run admin:password -- admin@kgb.co.rs NovaLozinka
 * The password is not stored anywhere else.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const [email, password] = process.argv.slice(2)
  if (!email || !password) {
    console.log('Upotreba: npm run admin:password -- email@primer.rs NovaLozinka')
    process.exit(1)
  }
  if (password.length < 8) {
    console.log('Lozinka mora imati bar 8 znakova.')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  const found = await payload.find({ collection: 'users', where: { email: { equals: email.toLowerCase() } }, limit: 1, overrideAccess: true })

  if (found.docs[0]) {
    // Also unlocks the account after too many failed logins.
    await payload.update({
      collection: 'users',
      id: found.docs[0].id,
      data: { password, loginAttempts: 0, lockUntil: null } as never,
      overrideAccess: true,
    })
    console.log(`Lozinka je promenjena za ${email} (nalog je otključan).`)
  } else {
    await payload.create({ collection: 'users', data: { email, password, name: 'Administrator' }, overrideAccess: true })
    console.log(`Napravljen je nalog ${email}.`)
  }

  // Proves the new password works against this database.
  console.log(`Baza: ${process.env.DATABASE_URL || 'file:./kgb.db'}`)
  try {
    await payload.login({ collection: 'users', data: { email, password } })
    console.log('Provera: prijava sa ovom lozinkom radi.')
  } catch (err) {
    console.log(`Provera: prijava NE radi – ${(err as Error).message}`)
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
