use std::{thread, time::Duration};

/// pause execution for n ms
pub fn pause_ms(ms: u64) {
    thread::sleep(Duration::from_millis(ms));
}
