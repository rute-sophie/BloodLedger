use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo};

use crate::Config;

pub fn mint_rewards<'info>(
    rewards_mint: AccountInfo<'info>,
    donor_token_account: AccountInfo<'info>,
    config: &Account<'info, Config>,
    token_program: AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    let cpi_accounts = MintTo {
        mint: rewards_mint,
        to: donor_token_account,
        authority: config.to_account_info(),
    };

    let cpi_program = token_program.to_account_info();

    let seeds = &[b"config".as_ref(), &[config.bump]];
    let signer_seeds = &[&seeds[..]];

    let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
    token::mint_to(cpi_context, amount)
}
