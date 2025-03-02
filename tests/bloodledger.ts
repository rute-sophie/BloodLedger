import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Bloodledger } from "../target/types/bloodledger";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import {assert, expect} from 'chai';




describe("bloodledger", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  
  const program = anchor.workspace.Bloodledger as Program<Bloodledger>;

  let admin: Keypair;
  let institutionAdmin: Keypair;
  let donor: Keypair;
  let rewardsMint: PublicKey;
  let donorAccount: PublicKey;
  let donorTokenAccount: PublicKey;
  let connection: Connection;

  let institution: PublicKey;

  before('', async () => {
    admin = Keypair.generate();
    donor = Keypair.generate();
    institutionAdmin = Keypair.generate();

    console.log("Admin pk= ", admin.publicKey);
    connection = anchor.getProvider().connection;

    const sigs = await Promise.all([

      connection.requestAirdrop(admin.publicKey, LAMPORTS_PER_SOL * 10),
      connection.requestAirdrop(donor.publicKey, LAMPORTS_PER_SOL * 10),
      connection.requestAirdrop(institutionAdmin.publicKey, LAMPORTS_PER_SOL * 10)]);

    await Promise.all([
      connection.confirmTransaction(sigs[0]),
      connection.confirmTransaction(sigs[1]),
      connection.confirmTransaction(sigs[2])
    ]);




  });

  it("Initialize config!", async () => {
    // Add your test here.
    const tx = await program.methods
    .initConfig()
    .accounts({authority: admin.publicKey})
    .signers([admin])
    .rpcAndKeys();

    rewardsMint = tx.pubkeys.rewardsMint;
    console.log("Your transaction signature", tx.signature);
  });

  it("Fail to init institution with different admin!", async () => {

    const tx = await program.methods
    .initInstitution("hospital santa maria")
    .accountsPartial({
      authority: institutionAdmin.publicKey,
      institutionOwner: institutionAdmin.publicKey
    })
    .signers([institutionAdmin])
    .rpc()
    .then(res => assert(false, ""))
    .catch(e => expect(e.error.errorMessage).to.equal("Unauthorized Access"));

  });

  it("Init institution!", async () => {

    const tx = await program.methods
    .initInstitution("hospital santa maria")
    .accountsPartial({
      authority: admin.publicKey,
      institutionOwner: institutionAdmin.publicKey
    })
    .signers([admin])
    .rpcAndKeys();
    console.log("Your transaction signature", tx.signature);
    institution = tx.pubkeys.institution;
  });

  
  it("Fail to register donor with invalid blood type!", async () => {

    const tx = await program.methods
    .registerDonor("ASD-")
    .accounts({
      owner: donor.publicKey,
    })
    .signers([donor])
    .rpc()
    .then(res => assert(false, ""))
    .catch(e => expect(e.error.errorMessage).to.equal("Invalid Blood Type"));

  });
  
  it("Register donor!", async () => {

    const tx = await program.methods
    .registerDonor("AB-")
    .accounts({
      owner: donor.publicKey,
    })
    .signers([donor])
    .rpcAndKeys();

    donorAccount = tx.pubkeys.donor;

    console.log("Your transaction signature", tx.signature);
  });


  
  it("Fail to register multiple donor accounts per donor wallet!", async () => {

    const tx = await program.methods
    .registerDonor("O-")
    .accounts({
      owner: donor.publicKey,
    })
    .signers([donor])
    .rpc()
    .then(res => assert(false, ""))
    .catch(e => {
      expect(e.logs.find((el)=>el.includes("base: None } already in use"))).to.not.be.null;
    }
    );

  });
  
  it("Fail to set incomplete Inventory!", async () => {

    const createType = (type, inventory, used, demand) => 
      { 
        return {
          bloodType: type,
          currentUnits: new BN(inventory),
          used: new BN(used),
          demand
        }
      };

    await program.methods
    .setInventory(
      [
        createType("O+", 100, 0, 0),
        createType("O-", 100, 0, 0),
      ]
    )
    .accountsPartial({
      owner: institutionAdmin.publicKey,
      institution
    })
    .signers([institutionAdmin])
    .rpc()
    .then(res => assert(false, ""))
    .catch(e => expect(e.error.errorMessage).to.equal("The program could not deserialize the given instruction"));
    
  });
  
  it("Fail to set invalid blood type in Inventory!", async () => {

    const createType = (type, inventory, used, demand) => 
      { 
        return {
          bloodType: type,
          currentUnits: new BN(inventory),
          used: new BN(used),
          demand
        }
      };

    await program.methods
    .setInventory(
      [
        createType("ASD+", 100, 0, 0),
        createType("O-", 100, 0, 0),
        createType("A+", 100, 0, 0),
        createType("A-", 100, 0, 0),
        createType("B+", 100, 0, 0),
        createType("B-", 100, 0, 0),
        createType("AB+", 100, 0, 0),
        createType("AB-", 100, 0, 0),
      ]
    )
    .accountsPartial({
      owner: institutionAdmin.publicKey,
      institution
    })
    .signers([institutionAdmin])
    .rpc()
    .then(res => assert(false, ""))
    .catch(e => expect(e.error.errorMessage).to.equal("Invalid Blood Type"));
  });
  
  it("Fail to set duplicated blood type in Inventory!", async () => {

    const createType = (type, inventory, used, demand) => 
      { 
        return {
          bloodType: type,
          currentUnits: new BN(inventory),
          used: new BN(used),
          demand
        }
      };

    await program.methods
    .setInventory(
      [
        createType("O-", 100, 0, 0),
        createType("O-", 100, 0, 0),
        createType("A+", 100, 0, 0),
        createType("A-", 100, 0, 0),
        createType("B+", 100, 0, 0),
        createType("B-", 100, 0, 0),
        createType("AB+", 100, 0, 0),
        createType("AB-", 100, 0, 0),
      ]
    )
    .accountsPartial({
      owner: institutionAdmin.publicKey,
      institution
    })
    .signers([institutionAdmin])
    .rpc()
    .then(res => assert(false, ""))
    .catch(e => expect(e.error.errorMessage).to.equal("Duplicated Blood Type"));
  });
  
  it("Set Inventory!", async () => {

    const createType = (type, inventory, used, demand) => 
      { 
        return {
          bloodType: type,
          currentUnits: new BN(inventory),
          used: new BN(used),
          demand
        }
      };

    const tx = await program.methods
    .setInventory(
      [
        createType("O+", 100, 0, 0),
        createType("O-", 100, 0, 0),
        createType("A+", 100, 0, 0),
        createType("A-", 100, 0, 0),
        createType("B+", 100, 0, 0),
        createType("B-", 100, 0, 0),
        createType("AB+", 100, 0, 0),
        createType("AB-", 100, 0, 0),
      ]
    )
    .accountsPartial({
      owner: institutionAdmin.publicKey,
      institution
    })
    .signers([institutionAdmin])
    .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Add Donation <3!", async () => {
    // get or create donor ata for rewards mint

    donorTokenAccount = await getAssociatedTokenAddressSync(rewardsMint, donor.publicKey);

    // Solana uses seconds so this is to get UNIX Epoch time in seconds
    const now = Math.floor(Date.now() / 1000);
    const bloodExpired = now + 21 * 24 * 60 * 60; 

    const tx = await program.methods
    .addDonation("AB-", "BU1056", new BN(bloodExpired))
    .accountsPartial({
      owner: institutionAdmin.publicKey,
      institution,
      donor: donorAccount,
      donorTokenAccount: donorTokenAccount,
      donorWallet: donor.publicKey
    })
    .signers([institutionAdmin])
    .rpc();
    console.log("Your transaction signature", tx);
  });

  
  it("Fail to add donation with invalid institution owner address!", async () => {
    // Solana uses seconds so this is to get UNIX Epoch time in seconds
    const now = Math.floor(Date.now() / 1000);
    const bloodExpired = now + 21 * 24 * 60 * 60; 

    const tx = await program.methods
    .addDonation("AB-", "BU1056", new BN(bloodExpired))
    .accountsPartial({
      owner: donor.publicKey,
      institution,
      donor: donorAccount,
      donorTokenAccount: donorTokenAccount,
      donorWallet: donor.publicKey
    })
    .signers([donor])
    .rpc()
    .then(res => assert(false, ""))
    .catch(e => expect(e.error.errorMessage).to.equal("Unauthorized Access"));
  });
  
  
  it("Fail to add Donation with wrong type!", async () => {
    // Solana uses seconds so this is to get UNIX Epoch time in seconds
    const now = Math.floor(Date.now() / 1000);
    const bloodExpired = now + 21 * 24 * 60 * 60; 

    await program.methods
    .addDonation("AB+", "BU1056", new BN(bloodExpired))
    .accountsPartial({
      owner: institutionAdmin.publicKey,
      institution,
      donor: donorAccount,
      donorTokenAccount: donorTokenAccount,
      donorWallet: donor.publicKey
    })
    .signers([institutionAdmin])
    .rpc()
    .then(res => assert(false, ""))
    .catch(e => expect(e.error.errorMessage).to.equal("Invalid Blood Type"));
  
  });


  it("Add Blood Unit Used!", async () => {

    const donorTokenAccountBefore = await getAccount(connection, donorTokenAccount);

    const tx = await program.methods
    .addBloodUnitUsed("AB-", "BU1056", false, true)
    .accountsPartial({
      owner: institutionAdmin.publicKey,
      institution,
      donor: donorAccount,
      donorTokenAccount: donorTokenAccount,
      donorWallet: donor.publicKey
    })
    .signers([institutionAdmin])
    .rpc();

    console.log("Your transaction signature", tx);

    const donorTokenAccountAfter = await getAccount(connection, donorTokenAccount);

    expect(donorTokenAccountBefore.amount < donorTokenAccountAfter.amount).to.be.true;
  });

  it("Fail to add Blood Unit Used with invalid blood type!", async () => {
    const tx = await program.methods
    .addBloodUnitUsed("ASD-", "BU1056", false, true)
    .accountsPartial({
      owner: institutionAdmin.publicKey,
      institution,
      donor: donorAccount,
      donorTokenAccount: donorTokenAccount,
      donorWallet: donor.publicKey
    })
    .signers([institutionAdmin])
    .rpc()
    .then(res => assert(false, ""))
    .catch(e => expect(e.error.errorMessage).to.equal("Invalid Blood Type"));

  });

  it("Add expired Blood Unit Used!", async () => {

    const donorTokenAccountBefore = await getAccount(connection, donorTokenAccount);

    const tx = await program.methods
    .addBloodUnitUsed("AB-", "BU1056", true, true)
    .accountsPartial({
      owner: institutionAdmin.publicKey,
      institution,
      donor: donorAccount,
      donorTokenAccount: donorTokenAccount,
      donorWallet: donor.publicKey
    })
    .signers([institutionAdmin])
    .rpc();

    const donorTokenAccountAfter = await getAccount(connection, donorTokenAccount);

    expect(donorTokenAccountBefore.amount == donorTokenAccountAfter.amount).to.be.true;
  });

  it("Add bad health check Blood Unit Used!", async () => {

    const donorTokenAccountBefore = await getAccount(connection, donorTokenAccount);

    const tx = await program.methods
    .addBloodUnitUsed("AB-", "BU1056", false, false)
    .accountsPartial({
      owner: institutionAdmin.publicKey,
      institution,
      donor: donorAccount,
      donorTokenAccount: donorTokenAccount,
      donorWallet: donor.publicKey
    })
    .signers([institutionAdmin])
    .rpc();


    const donorTokenAccountAfter = await getAccount(connection, donorTokenAccount);

    expect(donorTokenAccountBefore.amount == donorTokenAccountAfter.amount).to.be.true;
  });

  it("Fail to add Blood Unit Used with donor wallet!", async () => {
    const tx = await program.methods
    .addBloodUnitUsed("AB-", "BU1056", false, true)
    .accountsPartial({
      owner: donor.publicKey,
      institution,
      donor: donorAccount,
      donorTokenAccount: donorTokenAccount,
      donorWallet: donor.publicKey
    })
    .signers([donor])
    .rpc()
    .then(res => assert(false, ""))
    .catch(e => expect(e.error.errorMessage).to.equal("Unauthorized Access"));
  });

});
