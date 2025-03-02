use anchor_lang::prelude::*;

#[event]
pub struct BloodUnitUsedEvent {
    pub timestamp: u64,
    pub blood_type: String,
    pub id: String,
    pub expired: bool,
    pub health_check: bool,
}
