use anchor_lang::prelude::*;

#[event]
pub struct DonationEvent {
    pub timestamp: u64,
    pub blood_type: String,
    pub id: String,
    pub expiration_date: u64,
}
