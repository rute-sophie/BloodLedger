use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
pub mod state;

pub use error::*;
pub use instructions::*;
pub use state::*;

declare_id!("CV7ZUsLNXej2JbLNwkwo8TjZWY7Shxi4dDBggemdNa8z");

#[program]
pub mod bloodledger {

    use super::*;

    pub fn init_config(ctx: Context<Init>) -> Result<()> {
        ctx.accounts.init(&ctx.bumps)
    }

    pub fn init_institution(ctx: Context<InitInstitution>, name: String) -> Result<()> {
        ctx.accounts.init_institution(name)
    }

    pub fn set_inventory(ctx: Context<SetInventory>, inventory: [Inventory;8]) -> Result<()> {
        ctx.accounts.set_inventory(inventory)
    }

    pub fn register_donor(ctx: Context<RegisterDonor>, blood_type: String) -> Result<()> {
        ctx.accounts.register_donor(blood_type)
    }

    pub fn add_donation(ctx: Context<AddDonationEvent>, blood_type_index: u8) -> Result<()> { 

        Ok(())
    }

    pub fn add_blood_unit_used(ctx: Context<AddBloodUnitUsedEvent>, blood_type_index: u8) -> Result<()> {


        Ok(())
    }
}
