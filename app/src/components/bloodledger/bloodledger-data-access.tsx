'use client'

import { BLOODLEDGER_PROGRAM_ID as programId, getBloodledgerProgram, deriveConfigPDA, getBloodledgerConfig, getAllInstitutions, getInstitutionFromOwner, getDonorFromWallet, deriveDonorPDA, deriveRewardsMintPDA } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'

import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import { BN } from '@coral-xyz/anchor'
import { getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount } from '@solana/spl-token'


export interface InventoryItem {
  bloodType: string;
  currentUnits: BN;
  used: BN;
  demand: number;
}

export interface InstitutionAccount {
  owner: PublicKey;
  name: string;
  inventory: InventoryItem[];
  publicKey?: PublicKey;
}

interface AddDonationParams {
  bloodType: string;
  id: string;
  expiry: BN;
  institution: PublicKey;
  donorWallet: PublicKey;
}

interface AddBloodUnitUsedParams {
  bloodType: string;
  id: string;
  expired: boolean;
  healthCheck: boolean;
  institution: PublicKey;
  donorWallet: PublicKey;
}

interface SetInventoryParams {
  institution: PublicKey;
  inventory: InventoryItem[];
}

export function useBloodledgerProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const program = getBloodledgerProgram(provider)

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })


  const init = useMutation({
       mutationKey: ['bloodledger', 'init', { cluster }],
       mutationFn: () => program.methods.initConfig().rpc(),
       onSuccess: (signature) => {
         transactionToast(signature)
       },
       onError: () => toast.error('Failed to run program'),
     })

  const initInstitution = useMutation({
       mutationKey: ['bloodledger', 'initInstitution', { cluster }],
       mutationFn: async ({ name, owner }: { name: string, owner: PublicKey }) => 
         program.methods.initInstitution(name)
         .accounts({
           institutionOwner: owner,
         })
         .rpc(),
       onSuccess: (signature) => {
         transactionToast(signature)
       },
       onError: () => toast.error('Failed to run program'),
     })

  const getInstitution = useMutation({
    mutationKey: ['bloodledger', 'getInstitution', { cluster }],
    mutationFn: async (owner: PublicKey) => {
      try {
        const account = await getInstitutionFromOwner(program, owner);
        return account;
      } catch (error) {
        toast.error('Failed to fetch institution account');
        throw error;
      }
    }
  })


  const getConfig = useMutation({
    mutationKey: ['bloodledger', 'getConfig', { cluster }],
    mutationFn: async () => {
      const config = await getBloodledgerConfig(program);
      return config;
    },
  })

  const getInstitutions = useQuery({
    queryKey: ['bloodledger', 'getAllInstitutions', { cluster }],
    queryFn: async () => {
      const institutions = await getAllInstitutions(program);
      return institutions;
    },
  })

  const setInventoryTransaction = useMutation({
    mutationKey: ['bloodledger', 'setInventory', { cluster }],
    mutationFn: async (params: SetInventoryParams) => {
      return program.methods.setInventory(params.inventory)
        .accounts({
          institution: params.institution,
        })
        .rpc()
    }
  })

  const addDonationTransaction = useMutation({
    mutationKey: ['bloodledger', 'addDonation', { cluster }],
    mutationFn: async (params: AddDonationParams) => {
      return program.methods.addDonation(params.bloodType, params.id, params.expiry).
      accounts({
        institution: params.institution,
        donor: deriveDonorPDA(programId, params.donorWallet),
        donorWallet: params.donorWallet,
      }).rpc()
    }
  })

  const registerDonorTransaction = useMutation({
    mutationKey: ['bloodledger', 'registerDonor', { cluster }],
    mutationFn: async (bloodType: string) => {
      return program.methods.registerDonor(bloodType).rpc()
    }
  })

  const addBloodUnitUsedTransaction = useMutation({
    mutationKey: ['bloodledger', 'addUsedUnits', { cluster }],
    mutationFn: async (params: AddBloodUnitUsedParams) => {
      return program.methods.addBloodUnitUsed(
        params.bloodType,
        params.id,
        params.expired,
        params.healthCheck
      ).accounts({
        institution: params.institution,
        donor: deriveDonorPDA(programId, params.donorWallet),
        donorWallet: params.donorWallet,
      }).rpc()
    }
  })

  const getDonor = useMutation({
    mutationKey: ['bloodledger', 'getDonor', { cluster }],
    mutationFn: async (donorWallet: PublicKey) => {
      const donor = await getDonorFromWallet(program, donorWallet);
      return donor;
    }
  })
  


  return {
    program,
    programId,
    getProgramAccount,
    init,
    initInstitution,
    getInstitution,
    getConfig,
    getInstitutions,
    setInventoryTransaction,
    addDonationTransaction,
    registerDonorTransaction,
    addBloodUnitUsedTransaction,  
    getDonor,
  }
}
