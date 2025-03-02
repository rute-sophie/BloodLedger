'use client'

import { useState, useEffect } from 'react'
import { InstitutionAccount, InventoryItem, useBloodledgerProgram } from './bloodledger-data-access'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'react-hot-toast'
import { BN } from '@coral-xyz/anchor'
import { ProgramAccount } from '@coral-xyz/anchor'

interface NewDonation {
  bloodType: string;
  id: string;
  expiryDays: string;
  donorWallet: string;
}

interface UsedUnit {
  bloodType: string;
  id: string;
  expired: boolean;
  healthCheck: boolean;
  donorWallet: string;
}

const BLOOD_TYPES = ['A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'O-', 'O+'] as const;

export function BasicCreate() {
  const { init, initInstitution, getConfig } = useBloodledgerProgram()
  const [institutionName, setInstitutionName] = useState('')
  const [institutionOwner, setInstitutionOwner] = useState('')
  const [ownerError, setOwnerError] = useState('')
  const [configExists, setConfigExists] = useState(false)

  useEffect(() => {
    checkConfig()
  }, [])

  const checkConfig = async () => {
    try {
      console.log('checking config');
      const config = await getConfig.mutateAsync();
      console.log('config', config);
      setConfigExists(!!config)
    } catch (error) {
      setConfigExists(false)
    }
  }

  const handleInitialize = async () => {
    await init.mutateAsync()
    checkConfig() // Recheck config after initialization
  }

  const validateOwner = (value: string) => {
    setInstitutionOwner(value)
    try {
      if (value) {
        new PublicKey(value)
        setOwnerError('')
      }
    } catch (error) {
      setOwnerError('Invalid public key')
    }
  }

  const handleInitInstitution = async () => {
    try {
      const ownerPubkey = new PublicKey(institutionOwner)
      await initInstitution.mutateAsync({ 
        name: institutionName, 
        owner: ownerPubkey 
      })
    } catch (error) {
      console.error('Failed to initialize institution:', error)
    }
  }

  const isValidForm = institutionName.trim() && 
    institutionOwner.trim() && 
    !ownerError && 
    configExists && 
    !initInstitution.isPending

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">System Config</span>
          </label>
          <button 
            className="btn btn-primary" 
            onClick={handleInitialize} 
            disabled={init.isPending || configExists}
          >
            {configExists ? 'Config Initialized' : 'Initialize Config'} {init.isPending && '...'}
          </button>

          <label className="label mt-4">
            <span className="label-text">Institution Name</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter institution name" 
            className="input input-bordered w-full"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
          />

          <label className="label mt-4">
            <span className="label-text">Institution Owner (Public Key)</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter owner's public key" 
            className={`input input-bordered w-full ${ownerError ? 'input-error' : ''}`}
            value={institutionOwner}
            onChange={(e) => validateOwner(e.target.value)}
          />
          {ownerError && (
            <label className="label">
              <span className="label-text-alt text-error">{ownerError}</span>
            </label>
          )}
        </div>
        <div className="flex gap-4">
          <button 
            className="btn btn-secondary" 
            onClick={handleInitInstitution}
            disabled={!isValidForm}
          >
            Register Institution {initInstitution.isPending && '...'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function BasicProgram() {
  const { getProgramAccount, programId } = useBloodledgerProgram()

  if (getProgramAccount.isLoading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info max-w-2xl mx-auto">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }

  return (
    <div className="card bg-base-200 shadow-xl max-w-4xl mx-auto">
      <div className="card-body">
        <h3 className="card-title text-lg mb-4">Program Account Details</h3>
        <h4>Program Account</h4>
        <p>Address: { programId.toBase58()}</p>
        <pre className="bg-base-300 p-4 rounded-lg overflow-auto">
          {JSON.stringify(getProgramAccount.data.value, null, 2)}
        </pre>
      </div>
    </div>
  )
}


export function ListInstitutions() {
  const { getInstitutions } = useBloodledgerProgram()

  if (getInstitutions.isLoading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="card bg-base-200 shadow-xl max-w-4xl mx-auto">
      <div className="card-body">
        <h3 className="card-title text-lg mb-4">Institutions</h3>
        <ul className="list-disc pl-5">
          {getInstitutions.data?.map((institution) => (
            <li className="mb-4" key={institution.publicKey.toBase58()}>
              <p className="font-bold">{institution.account.name}</p>
              <p className="text-sm text-gray-600">{institution.account.owner.toBase58()}</p>
              <ul className="list-disc pl-5">
                {institution.account.inventory.map((item, index) => (
                  <li key={index}>
                    Blood Type: {item.bloodType}, 
                    Current Units: {item.currentUnits.toString()}, 
                    Used: {item.used.toString()}, 
                    Demand Level: {item.demand}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function InstitutionManagement() {
  const { getInstitution, setInventoryTransaction, addDonationTransaction, addBloodUnitUsedTransaction, getDonor } = useBloodledgerProgram()
  const { publicKey } = useWallet()
  const [institution, setInstitution] = useState<ProgramAccount<InstitutionAccount> | null>(null)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newDonation, setNewDonation] = useState<NewDonation | null>(null)
  const [usedUnit, setUsedUnit] = useState<UsedUnit | null>(null)
  const [donationError, setDonationError] = useState('')
  const [usedUnitError, setUsedUnitError] = useState('')
  const [donorWalletError, setDonorWalletError] = useState('')
  const [isDonorValid, setIsDonorValid] = useState(false)

  useEffect(() => {
    if (publicKey) {
      fetchInstitution()
    }
  }, [publicKey])

  const fetchInstitution = async () => {
    if (!publicKey) return
    try {
      setIsLoading(true)
      const result = await getInstitution.mutateAsync(publicKey)
      setInstitution(result)
      setInventory(result.account.inventory.map((item, index) => {
        let bloodType = item.bloodType;
        if (!bloodType) {
          bloodType = getDefaultBloodType(index);
        }
        return {
          ...item,
          bloodType,
          currentUnits: new BN(item.currentUnits),
          used: new BN(item.used)
        };
      }))
    } catch (error) {
      console.error('Failed to fetch institution:', error)
      toast.error('Failed to fetch institution')
    } finally {
      setIsLoading(false)
    }
  }

  const getAvailableBloodTypes = (currentIndex: number) => {
    const usedTypes = inventory
      .map((item, idx) => idx !== currentIndex && item.bloodType ? item.bloodType : null)
      .filter((type): type is string => type !== null);
    return BLOOD_TYPES.filter(type => !usedTypes.includes(type));
  }

  const getDefaultBloodType = (index: number) => {
    const availableTypes = getAvailableBloodTypes(index);
    if (availableTypes.length === 0) return '';
    // Use the index to pick a different default blood type for each row
    return availableTypes[Math.min(index, availableTypes.length - 1)];
  }

  const handleInventoryChange = (index: number, field: keyof InventoryItem, value: string) => {
    const newInventory = [...inventory]
    if (field === 'bloodType') {
      if (!value) {
        value = getDefaultBloodType(index);
      }
      newInventory[index] = { ...newInventory[index], [field]: value }
    } else if (field === 'demand') {
      const numValue = Math.min(Math.max(parseInt(value) || 0, 0), 255)
      newInventory[index] = { ...newInventory[index], [field]: numValue }
    } else {
      // Handle BN fields (currentUnits and used)
      const numValue = parseInt(value) || 0
      newInventory[index] = { 
        ...newInventory[index], 
        [field]: new BN(numValue)
      }
    }
    setInventory(newInventory)
  }

  const handleSubmitInventory = async () => {
    if (!institution) return
    try {
      setIsLoading(true)
      await setInventoryTransaction.mutateAsync({
        institution: institution.publicKey,
        inventory: inventory
      })
      toast.success('Inventory updated successfully')
      await fetchInstitution() // Refresh data
    } catch (error) {
      console.error('Failed to update inventory:', error)
      toast.error('Failed to update inventory')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDonation = async () => {
    if (!newDonation || !institution?.publicKey) return;
    try {
      await addDonationTransaction.mutateAsync({
        bloodType: newDonation.bloodType,
        id: newDonation.id,
        expiry: new BN(parseInt(newDonation.expiryDays)),
        institution: institution.publicKey,
        donorWallet: new PublicKey(newDonation.donorWallet)
      });
      setNewDonation(null);
      toast.success('Donation registered successfully');
    } catch (error) {
      console.error('Failed to add donation:', error);
      toast.error('Failed to add donation');
    }
  };

  const handleRecordUsedUnit = async () => {
    if (!usedUnit || !institution?.publicKey) return;
    try {
      await addBloodUnitUsedTransaction.mutateAsync({
        bloodType: usedUnit.bloodType,
        id: usedUnit.id,
        expired: usedUnit.expired,
        healthCheck: usedUnit.healthCheck,
        institution: institution.publicKey,
        donorWallet: new PublicKey(usedUnit.donorWallet)
      });
      setUsedUnit(null);
      toast.success('Used unit recorded successfully');
    } catch (error) {
      console.error('Failed to record used unit:', error);
      toast.error('Failed to record used unit');
    }
  };

  const validateDonorWallet = async (value: string) => {
    try {
      if (value) {
        const pubkey = new PublicKey(value)
        setDonorWalletError('')
        try {
          const donor = await getDonor.mutateAsync(pubkey)
          if (donor) {
            setIsDonorValid(true)
            return true
          } else {
            setDonorWalletError('No donor account found for this wallet')
            setIsDonorValid(false)
            return false
          }
        } catch (error) {
          setDonorWalletError('No donor account found for this wallet')
          setIsDonorValid(false)
          return false
        }
      }
      setIsDonorValid(false)
      return false
    } catch (error) {
      setDonorWalletError('Invalid public key')
      setIsDonorValid(false)
      return false
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!institution) {
    return (
      <div className="alert alert-info max-w-2xl mx-auto">
        <span>No institution found for your wallet. Please register as an institution first.</span>
      </div>
    )
  }

  return (
    <div className="card bg-base-200 shadow-xl max-w-4xl mx-auto">
      <div className="card-body">
        <h3 className="card-title text-lg mb-4">Institution Management</h3>
        <div className="mb-4">
          <p className="font-bold">{institution.account.name}</p>
          <p className="text-sm text-gray-600">Owner: {institution.account.owner.toBase58()}</p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold">Inventory Management</h4>
          {inventory.map((item, index) => (
            <div key={index} className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Blood Type</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={item.bloodType || getDefaultBloodType(index)}
                      onChange={(e) => handleInventoryChange(index, 'bloodType', e.target.value)}
                    >
                      {item.bloodType ? (
                        <option value={item.bloodType}>{item.bloodType}</option>
                      ) : (
                        <option value={getDefaultBloodType(index)}>
                          {getDefaultBloodType(index)}
                        </option>
                      )}
                      {getAvailableBloodTypes(index)
                        .filter(type => type !== item.bloodType && type !== getDefaultBloodType(index))
                        .map(type => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Current Units</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={item.currentUnits.toString()}
                      onChange={(e) => handleInventoryChange(index, 'currentUnits', e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Used Units</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={item.used.toString()}
                      onChange={(e) => handleInventoryChange(index, 'used', e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Demand Level (0-255)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="255"
                      className="input input-bordered w-full"
                      value={item.demand}
                      onChange={(e) => handleInventoryChange(index, 'demand', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-actions justify-end mt-6">
          <button 
            className="btn btn-primary" 
            onClick={handleSubmitInventory}
            disabled={isLoading}
          >
            Update Inventory {isLoading && '...'}
          </button>
        </div>
      </div>
      <div className="card bg-base-200 shadow-xl mt-6">
        <div className="card-body">
          <h2 className="card-title">Manage Blood Units</h2>

          {/* Register New Donation */}
          <div className="form-control w-full max-w-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Register New Donation</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Blood Type</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={newDonation?.bloodType || ''}
                  onChange={(e) => setNewDonation(prev => ({
                    bloodType: e.target.value,
                    id: prev?.id || '',
                    expiryDays: prev?.expiryDays || '',
                    donorWallet: prev?.donorWallet || ''
                  }))}
                >
                  <option value="">Select blood type</option>
                  {BLOOD_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Unit ID</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Unique ID for this donation"
                  value={newDonation?.id || ''}
                  onChange={(e) => setNewDonation(prev => ({
                    bloodType: prev?.bloodType || '',
                    id: e.target.value,
                    expiryDays: prev?.expiryDays || '',
                    donorWallet: prev?.donorWallet || ''
                  }))}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Expiry Date (days from now)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Number of days"
                  value={newDonation?.expiryDays || ''}
                  onChange={(e) => setNewDonation(prev => ({
                    bloodType: prev?.bloodType || '',
                    id: prev?.id || '',
                    expiryDays: e.target.value,
                    donorWallet: prev?.donorWallet || ''
                  }))}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Donor Wallet</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${donorWalletError && newDonation?.donorWallet ? 'input-error' : ''}`}
                  placeholder="Enter donor's public key"
                  value={newDonation?.donorWallet || ''}
                  onChange={async (e) => {
                    const value = e.target.value;
                    await validateDonorWallet(value);
                    setNewDonation(prev => ({
                      bloodType: prev?.bloodType || '',
                      id: prev?.id || '',
                      expiryDays: prev?.expiryDays || '',
                      donorWallet: value
                    }));
                  }}
                />
                {donorWalletError && newDonation?.donorWallet && (
                  <label className="label">
                    <span className="label-text-alt text-error">{donorWalletError}</span>
                  </label>
                )}
              </div>
              <button 
                className="btn btn-primary mt-2"
                onClick={handleAddDonation}
                disabled={!newDonation?.bloodType || !newDonation?.id || !newDonation?.expiryDays || !newDonation?.donorWallet || !!donorWalletError || !isDonorValid}
              >
                Register Donation
              </button>
            </div>
          </div>

          {/* Record Used Unit */}
          <div className="form-control w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Record Used Blood Unit</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Blood Type</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={usedUnit?.bloodType || ''}
                  onChange={(e) => setUsedUnit(prev => ({
                    bloodType: e.target.value,
                    id: prev?.id || '',
                    expired: prev?.expired || false,
                    healthCheck: prev?.healthCheck || false,
                    donorWallet: prev?.donorWallet || ''
                  }))}
                >
                  <option value="">Select blood type</option>
                  {BLOOD_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Unit ID</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="ID of the used unit"
                  value={usedUnit?.id || ''}
                  onChange={(e) => setUsedUnit(prev => ({
                    bloodType: prev?.bloodType || '',
                    id: e.target.value,
                    expired: prev?.expired || false,
                    healthCheck: prev?.healthCheck || false,
                    donorWallet: prev?.donorWallet || ''
                  }))}
                />
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Expired</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={usedUnit?.expired || false}
                    onChange={(e) => setUsedUnit(prev => ({
                      bloodType: prev?.bloodType || '',
                      id: prev?.id || '',
                      expired: e.target.checked,
                      healthCheck: prev?.healthCheck || false,
                      donorWallet: prev?.donorWallet || ''
                    }))}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Passed Health Check</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={usedUnit?.healthCheck || false}
                    onChange={(e) => setUsedUnit(prev => ({
                      bloodType: prev?.bloodType || '',
                      id: prev?.id || '',
                      expired: prev?.expired || false,
                      healthCheck: e.target.checked,
                      donorWallet: prev?.donorWallet || ''
                    }))}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Donor Wallet</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${donorWalletError && usedUnit?.donorWallet ? 'input-error' : ''}`}
                  placeholder="Enter donor's public key"
                  value={usedUnit?.donorWallet || ''}
                  onChange={async (e) => {
                    const value = e.target.value;
                    await validateDonorWallet(value);
                    setUsedUnit(prev => ({
                      bloodType: prev?.bloodType || '',
                      id: prev?.id || '',
                      expired: prev?.expired || false,
                      healthCheck: prev?.healthCheck || false,
                      donorWallet: value
                    }));
                  }}
                />
                {donorWalletError && usedUnit?.donorWallet && (
                  <label className="label">
                    <span className="label-text-alt text-error">{donorWalletError}</span>
                  </label>
                )}
              </div>
              <button 
                className="btn btn-primary mt-2"
                onClick={handleRecordUsedUnit}
                disabled={!usedUnit?.bloodType || !usedUnit?.id || !usedUnit?.donorWallet || !!donorWalletError || !isDonorValid}
              >
                Record Used Unit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DonorManagement() {
  const { getDonor, registerDonorTransaction } = useBloodledgerProgram()
  const { publicKey } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [donor, setDonor] = useState<any>(null)
  const [selectedBloodType, setSelectedBloodType] = useState<string>('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (publicKey) {
      fetchDonor()
    }
  }, [publicKey])

  const fetchDonor = async () => {
    if (!publicKey) return
    try {
      setIsLoading(true)
      setError('')
      const result = await getDonor.mutateAsync(publicKey)
      console.log('donor', result)
      setDonor(result)
    } catch (error) {
      console.error('Failed to fetch donor:', error)
      setError('No donor account found for this wallet')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterDonor = async () => {
    if (!selectedBloodType || !publicKey) return
    try {
      setIsLoading(true)
      setError('')
      await registerDonorTransaction.mutateAsync(selectedBloodType)
      toast.success('Successfully registered as donor')
      await fetchDonor() // Refresh donor data
    } catch (error) {
      console.error('Failed to register donor:', error)
      toast.error('Failed to register as donor')
    } finally {
      setIsLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="alert alert-warning max-w-2xl mx-auto">
        <span>Please connect your wallet to manage your donor account.</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="card bg-base-200 shadow-xl max-w-4xl mx-auto">
      <div className="card-body">
        <h3 className="card-title text-lg mb-4">Donor Management</h3>
        
        {donor ? (
          <div className="space-y-4">
            <div className="bg-base-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Donor Information</h4>
              <p>Wallet: {publicKey.toBase58()}</p>
              <p>Blood Type: {donor.bloodType}</p>
              <p>Last Donation: {donor.lastDonation > 0 ? new Date(donor.lastDonation * 1000).toLocaleDateString() : 'Never'}</p>
              <p>Number of Donations: {donor.numberDonation.toString()}</p>
              <p>Total Rewards: {donor.totalRewards.toString()}</p>
              {donor.numberDonation === 0 && (
                <p>Health Check: {donor.healthCheck ? 'Passed' : 'Failed'}</p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                Your donor account is registered and active.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="alert alert-info">
              <span>No donor account found for your wallet. Register as a donor below.</span>
            </div>
            
            <div className="form-control w-full max-w-md">
              <label className="label">
                <span className="label-text">Your Blood Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedBloodType}
                onChange={(e) => setSelectedBloodType(e.target.value)}
              >
                <option value="">Select blood type</option>
                {BLOOD_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <button 
                className="btn btn-primary mt-4"
                onClick={handleRegisterDonor}
                disabled={!selectedBloodType || isLoading}
              >
                Register as Donor {isLoading && '...'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error mt-4">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

