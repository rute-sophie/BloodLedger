use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo};

use crate::{Config, CustomError, Inventory};

const VALID_BLOOD_TYPES: [&str; 8] = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

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


//Function to validate an array of blood type entries

pub fn validate_inventory(inventory: &[Inventory]) -> Result<()> {
    let mut types: Vec<&String> = vec![];
    for entry in inventory {
        // Check if the blood type exists in the array using `.iter().find()`
        validate_blood_type(&entry.blood_type)?;

        if types.iter().find(|&&t| *t == entry.blood_type).is_some() {
            return Err(CustomError::DuplicatedBloodType.into());
        } 
        types.push(&entry.blood_type);
    }
    
    Ok(())
}

pub fn validate_blood_type(blood_type: &String) -> Result<()> {
    if VALID_BLOOD_TYPES.iter().find(|&&b| b == blood_type).is_none() {
        msg!("Invalid blood type detected: {}", blood_type);
        return Err(CustomError::InvalidBloodType.into());
    }
    Ok(())
}

