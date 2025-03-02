'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { useBloodledgerProgram } from './bloodledger-data-access'
import { BasicCreate, BasicProgram, DonorManagement, InstitutionManagement, ListInstitutions } from './bloodledger-ui'

export default function BloodledgerFeature() {
  const { publicKey } = useWallet()
  const { programId } = useBloodledgerProgram()
  const [activeTab, setActiveTab] = useState('program') // 'program', 'admin', 'institution', or 'donor'

  return publicKey ? (
    <div>
      <div className="container mx-auto px-4">
        <div className="tabs tabs-boxed justify-center">
          <a 
            className={`tab ${activeTab === 'program' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('program')}
          >
            Program
          </a>
          <a 
            className={`tab ${activeTab === 'admin' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            System Admin
          </a>
          <a 
            className={`tab ${activeTab === 'institution' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('institution')}
          >
            Institution
          </a>
          <a 
            className={`tab ${activeTab === 'donor' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('donor')}
          >
            Donor
          </a>
        </div>

        <div className="p-4">
          {activeTab === 'program' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-4">Program Status</h2>
              <BasicProgram />
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-4">System Administration</h2>
              <div className="flex justify-center">
                <BasicCreate />
                <ListInstitutions />
              </div>
            </div>
          )}

          {activeTab === 'institution' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-4">Institution Management</h2>
              <p className="text-center text-gray-600">
                Manage blood bank institutions and their operations
              </p>
              <InstitutionManagement />
            </div>
          )}

          {activeTab === 'donor' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-4">Donor Management</h2>
              <p className="text-center text-gray-600">
                Register and manage blood donors
              </p>
              <DonorManagement />
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-4">Welcome to BloodLedger</h1>
            <p className="py-6">Connect your wallet to access the blood bank management system</p>
            <WalletButton className="btn btn-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
