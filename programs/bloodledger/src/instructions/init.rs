use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};

use crate::state::Config;

#[derive(Accounts)]
//Initializes config account.
pub struct Init<'info> {
    //Payer
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        seeds = [b"config".as_ref()],
        bump,
        space = 8 + Config::INIT_SPACE,
    )]
    pub config: Account<'info, Config>,
    
    //Initializes rewards mint with a CPI to the token program.
    #[account(
        init,
        payer = authority,
        seeds = [b"rewards".as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority = config,
    )]
    pub rewards_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>
}

impl<'info> Init<'info> {
    pub fn init(
        &mut self,
        bumps: &InitBumps,
    ) -> Result<()> {
        let _ = bumps;
        self.config.set_inner(Config {
            authority: self.authority.key(),
            rewards_mint: self.rewards_mint.key()
        });




        Ok(())
    }
}