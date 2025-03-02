//An institution admin can set a blood unit as used in patients or as discarded (by health check or expiry date).
//The contract will update the donor and the institution inventory records.
//If the blood unit was used, extra rewards in the form of tokens will be issued to the donor by executing a CPI into the token program, proportional to the demand value.
//A Blood Unit Used event will be issued with the relevant data.
use crate::state::{Config, Institution};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

#[derive(Accounts)]
pub struct AddBloodUnitUsedEvent<'info> {
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
