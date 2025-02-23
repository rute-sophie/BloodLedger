use anchor_lang::error_code;

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized Access")]
    Unauthorized,
    #[msg("Invalid Blood Type Index")]
    InvalidBloodType,
    #[msg("Insufficient Blood Stock")]
    InsufficientStock,
}