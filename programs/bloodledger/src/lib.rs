use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
pub mod state;
mod utils;

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

    pub fn set_inventory(ctx: Context<SetInventory>, inventory: [Inventory; 8]) -> Result<()> {
        ctx.accounts.set_inventory(inventory)
    }

    pub fn register_donor(ctx: Context<RegisterDonor>, blood_type: String) -> Result<()> {
        ctx.accounts.register_donor(blood_type)
    }

    pub fn add_donation(
        ctx: Context<AddDonationEvent>,
        blood_type: String,
        id: String,
        expiration_date: u64,
    ) -> Result<()> {
        ctx.accounts.add_donation(blood_type, id, expiration_date)
    }

    pub fn add_blood_unit_used(
        ctx: Context<AddBloodUnitUsedEvent>,
        blood_type: String,
        id: String,
        expired: bool,
        health_check: bool,
    ) -> Result<()> {
        ctx.accounts
            .add_blood_unit_used(blood_type, id, expired, health_check)
    }
}
