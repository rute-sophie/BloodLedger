use anchor_lang::prelude::*;

#[derive(InitSpace)]
#[account]
pub struct Donor {
    pub owner: Pubkey,
    #[max_len(32)]
    pub blood_type: String, //4 len + 32 bytes
    pub last_donation: u64,
    pub number_donation: u64,
    pub total_rewards: u64,
    pub health_check: bool,
}

impl Donor {}
