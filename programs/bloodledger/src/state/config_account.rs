use anchor_lang::prelude::*;

#[derive(InitSpace)]
#[account]
pub struct Config {
    pub authority: Pubkey,
    pub rewards_mint: Pubkey
}