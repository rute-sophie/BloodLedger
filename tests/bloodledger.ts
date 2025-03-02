import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Bloodledger } from "../target/types/bloodledger";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
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

    const ata = await getOrCreateAssociatedTokenAccount(connection, donor, rewardsMint, donor.publicKey);

    donorTokenAccount = ata.address;
    // Solana uses seconds so this is to get UNIX Epoch time in seconds
    const now = Math.floor(Date.now() / 1000);
    const bloodExpired = now + 21 * 24 * 60 * 60; 

    const tx = await program.methods
    .addDonation("AB-", "BU1056", new BN(bloodExpired))
    .accountsPartial({
      owner: institutionAdmin.publicKey,
      institution,
      donor: donorAccount,
      donorTokenAccount: ata.address
    })
    .signers([institutionAdmin])
    .rpc();
    console.log("Your transaction signature", tx);
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
      donorTokenAccount: donorTokenAccount
    })
    .signers([institutionAdmin])
    .rpc()
    .then(res => assert(false, ""))
    .catch(e => expect(e.error.errorMessage).to.equal("Invalid Blood Type"));
  
  });

});
