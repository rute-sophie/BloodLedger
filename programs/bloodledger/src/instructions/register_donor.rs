//A blood donor can register at any time.

use crate::state::Donor;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct RegisterDonor<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + Donor::INIT_SPACE,
        seeds = [b"donor".as_ref(), owner.key().as_ref()],
        bump
    )]
    pub donor: Account<'info, Donor>,

    pub system_program: Program<'info, System>,
}

impl<'info> RegisterDonor<'info> {
    pub fn register_donor(&mut self, blood_type: String) -> Result<()> {
        self.donor.blood_type = blood_type;
        self.donor.owner = self.owner.key();

        Ok(())
    }
}
