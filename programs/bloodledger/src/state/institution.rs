use anchor_lang::prelude::*;

#[derive(InitSpace)]
#[account]
pub struct Institution {
    pub owner: Pubkey,
    #[max_len(32)]
    pub name: String, //4 len + 32 bytes
    pub inventory: [Inventory; 8], //should inventory be private since it is a specific struct inside of Institution only?
                                   //Tho the events will need to access it to make changes
}

// struct inside Institution account PDA, which is an array with 8 items
#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Clone, Default)]
pub struct Inventory {
    #[max_len(32)]
    pub blood_type: String,
    pub current_units: u64,
    pub used: u64,
    pub demand: u8,
}

//Todo
impl Institution {}

//Todo
#[derive(Accounts)]
pub struct EmitEvent<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
}
