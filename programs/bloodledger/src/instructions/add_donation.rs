//An institution admin can add a user donation to the system.
//The contract will update the donor and the institution inventory records.
//A small reward in the form of tokens will be issued by executing a CPI into the token program, proportional to the demand value.
//A Donation event will be issued with the blood donation data.

use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use crate::state::{Config, Donor, Institution};

#[derive(Accounts)]
pub struct AddDonationEvent<'info> {
    #[account(mut)]
    pub donor: Account<'info, Donor>,
    #[account(mut)]
    pub institution: Account<'info, Institution>,
    #[account(mut)]
    pub reward_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub donor_wallet: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub config: Account<'info, Config>,
}