use crate::state::{Institution, Inventory};
use anchor_lang::prelude::*;

//After an admin initializes the institution account, the institution admin needs to set current inventory and demand.
//Admin can use this anytime to set demand values.

#[derive(Accounts)]
pub struct SetInventory<'info> {
    pub owner: Signer<'info>,

    #[account(
        mut,
        has_one = owner,
    )]
    pub institution: Account<'info, Institution>,
}

impl<'info> SetInventory<'info> {
    pub fn set_inventory(&mut self, inventory: [Inventory; 8]) -> Result<()> {
        self.institution.inventory = inventory;
        Ok(())
    }
}
