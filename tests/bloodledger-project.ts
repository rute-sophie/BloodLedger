import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Bloodledger } from "../target/types/bloodledger";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";



describe("bloodledger-project", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.BloodledgerProject as Program<Bloodledger>;

  let admin: Keypair;
  let institutionAdmin: Keypair;
  let donor: Keypair;
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
    .rpc();

    console.log("Your transaction signature", tx);
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
    .registerDonor("O+")
    .accounts({
      owner: donor.publicKey,
    })
    .signers([donor])
    .rpc();
    console.log("Your transaction signature", tx);
  });

  
  it("Set Inventory!", async () => {

    const createType = (type, inventory, used, demand) => 
      { 
        return {
          bloodType: type,
          inventory: new BN(inventory),
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


});
