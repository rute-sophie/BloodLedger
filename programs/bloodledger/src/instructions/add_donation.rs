//An institution admin can add a user donation to the system.
//The contract will update the donor and the institution inventory records.
//A small reward in the form of tokens will be issued by executing a CPI into the token program, proportional to the demand value.
//A Donation event will be issued with the blood donation data.

use crate::{
    state::{Config, Donor, Institution},
    utils::mint_rewards,
    CustomError, DonationEvent,
};
use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{Mint, Token, TokenAccount}};

#[derive(Accounts)]
pub struct AddDonationEvent<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        has_one = owner @ CustomError::Unauthorized,
    )]
    pub institution: Account<'info, Institution>,

    #[account(
        mut,
        constraint = donor.owner == donor_wallet.key(),
    )]
    pub donor: Account<'info, Donor>,

    pub donor_wallet: SystemAccount<'info>,

    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = rewards_mint,
        associated_token::authority = donor_wallet,
    )]
    pub donor_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"rewards".as_ref()],
        bump
    )]
    pub rewards_mint: Account<'info, Mint>,

    #[account(
        seeds = [b"config".as_ref()], 
        bump
    )]
    pub config: Account<'info, Config>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> AddDonationEvent<'info> {
    pub fn add_donation(
        &mut self,
        blood_type: String,
        id: String,
        expiration_date: u64,
    ) -> Result<()> {
        // checks if the blood type of the donation mataches the donor's
        require!(
            blood_type == self.donor.blood_type,
            CustomError::InvalidBloodType
        );

        //looks for the object that represents that specific blood type inside inventory array
        let inventory = self
            .institution
            .inventory
            .iter_mut()
            .find(|inventory| inventory.blood_type == blood_type)
            .unwrap();

        // added 1 unit to the blood inventory of the institution
        inventory.current_units += 1;

        let current_time = Clock::get()?.unix_timestamp as u64;

        self.donor.last_donation = current_time;
        self.donor.number_donation += 1;

        // The token reward amount is adjusted based on demand, making it proportional to the rarity of the blood type.
        let rewards = (1 + inventory.demand as u64) * 10u64.pow(self.rewards_mint.decimals as u32);

        self.donor.total_rewards += rewards;

        mint_rewards(
            self.rewards_mint.to_account_info(),
            self.donor_token_account.to_account_info(),
            &self.config,
            self.token_program.to_account_info(),
            rewards,
        )?;

        emit!(DonationEvent {
            timestamp: current_time,
            blood_type,
            id,
            expiration_date
        });

        Ok(())
    }
}
