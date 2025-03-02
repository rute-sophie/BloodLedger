use anchor_lang::error_code;

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized Access")]
    Unauthorized,
    #[msg("Invalid Blood Type")]
    InvalidBloodType,
    #[msg("Duplicated Blood Type")]
    DuplicatedBloodType,
    #[msg("Insufficient Blood Stock")]
    InsufficientStock,
}
