//A blood donor can register at any time.

use anchor_lang::prelude::*;
use crate::state::Donor;

#[derive(Accounts)]
pub struct RegisterDonor<'info> {
    #[account(init, payer = user, space = 8 + 64)]
    pub donor: Account<'info, Donor>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}