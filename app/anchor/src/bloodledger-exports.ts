// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import BloodledgerIDL from './bloodledger.json'
import type { Bloodledger } from './bloodledger.ts'

// Re-export the generated IDL and type
export { Bloodledger, BloodledgerIDL }

// The programId is imported from the program IDL.
export const BLOODLEDGER_PROGRAM_ID = new PublicKey(BloodledgerIDL.address)

// This is a helper function to get the Bloodledger Anchor program.
export function getBloodledgerProgram(provider: AnchorProvider) {
  return new Program(BloodledgerIDL as Bloodledger, provider)
}


export async function getBloodledgerConfig(program: Program<Bloodledger>) {
  return program.account.config.fetch(deriveConfigPDA(program.programId))
}

export async function getInstitutionFromName(program: Program<Bloodledger>, institutionName: string) {
  return program.account.institution.fetch(deriveInstitutionPDA(program.programId, institutionName))
}

export async function getInstitution(program: Program<Bloodledger>, institution: PublicKey) {
  return program.account.institution.fetch(institution)
}

export function deriveConfigPDA(programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('config')],
    programId,
  )[0]
}

export function deriveRewardsMintPDA(programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('rewards')],
    programId,
  )[0]
}

export function deriveInstitutionPDA(programId: PublicKey, institutionName: string) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('institution'), Buffer.from(institutionName)],
    programId,
  )[0]
}

export function deriveDonorPDA(programId: PublicKey, donorWallet: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('donor'), donorWallet.toBuffer()],
    programId,
  )[0]
}

export async function getInstitutionFromOwner(program: Program<Bloodledger>, owner: PublicKey) {
  const institutions = await program.account.institution.all([
    {
      memcmp: {
        offset: 8,
        bytes: owner.toBase58(),
      },
    },
  ])
  return institutions[0]
}

export async function getDonorFromWallet(program: Program<Bloodledger>, donorWallet: PublicKey) {
  return program.account.donor.fetch(deriveDonorPDA(program.programId, donorWallet))
}

export async function getAllInstitutions(program: Program<Bloodledger>) {
  return program.account.institution.all()
}

export async function getAllDonors(program: Program<Bloodledger>) {
  return program.account.donor.all()
}