use anchor_lang::prelude::*;

use crate::{
    state::{Config, Institution},
    CustomError,
};

//Initializes a new institution account.

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitInstitution<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + Institution::INIT_SPACE,
        seeds = [b"institution".as_ref(), name.as_ref()],
        bump,
    )]
    pub institution: Account<'info, Institution>,
    #[account(mut)]
    pub institution_owner: SystemAccount<'info>,
    #[account(
        seeds = [b"config".as_ref()], 
        bump,
        has_one = authority @ CustomError::Unauthorized,
        // only works if they have the same name.
        // same as doing constraint = config.authority == authority.key()
    )]
    pub config: Account<'info, Config>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitInstitution<'info> {
    pub fn init_institution(&mut self, name: String) -> Result<()> {
        self.institution.name = name;
        self.institution.owner = self.institution_owner.key();

        Ok(())
    }
}
