//An institution admin can set a blood unit as used in patients or as discarded (by health check or expiry date).
//The contract will update the donor and the institution inventory records.
//If the blood unit was used, extra rewards in the form of tokens will be issued to the donor by executing a CPI into the token program, proportional to the demand value.
//A Blood Unit Used event will be issued with the relevant data.

use crate::{
    state::{Config, Donor, Institution},
    utils::mint_rewards,
    BloodUnitUsedEvent, CustomError,
};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
pub struct AddBloodUnitUsedEvent<'info> {
    pub owner: Signer<'info>,

    #[account(
        mut,
        has_one = owner @ CustomError::Unauthorized,
    )]
    pub institution: Account<'info, Institution>,

    #[account(mut)]
    pub donor: Account<'info, Donor>,

    #[account(mut)]
    pub donor_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"rewards".as_ref()],
        bump
    )]
    pub rewards_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    #[account(
        seeds = [b"config".as_ref()], 
        bump
    )]
    pub config: Account<'info, Config>,
}

impl<'info> AddBloodUnitUsedEvent<'info> {
    pub fn add_blood_unit_used(
        &mut self,
        blood_type: String,
        id: String,
        expired: bool,
        health_check: bool,
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

        // remove 1 unit off the blood inventory of the institution
        inventory.current_units -= 1;

        // gets current time to be used in timestamp
        let current_time = Clock::get()?.unix_timestamp as u64;

        // check if the blood unit passes the health tests. If it does, it will update the flag health_check as TRUE and increase the donor counter: total number of donations. If it doesn’t, it will update the donor health_check as FALSE.
        self.donor.health_check = health_check;
        if health_check {
            self.donor.number_donation += 1;
        }

        if !expired && health_check {
            // The token reward amount is adjusted based on demand, making it proportional to the rarity of the blood type.
            //Additionally, it is multiplied by 10 when the blood unit is used, as this action is more highly rewarded.
            let rewards =
                (1 + inventory.demand as u64) * 10u64.pow(self.rewards_mint.decimals as u32) * 10;
            self.donor.total_rewards += rewards;
            mint_rewards(
                self.rewards_mint.to_account_info(),
                self.donor_token_account.to_account_info(),
                &self.config,
                self.token_program.to_account_info(),
                rewards,
            )?;
        }

        emit!(BloodUnitUsedEvent {
            timestamp: current_time,
            blood_type,
            id,
            expired,
            health_check
        });

        Ok(())
    }
}
