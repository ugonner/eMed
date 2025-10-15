export enum PaymentMethod {
    PAYSTACK = "Paystack"
}

export enum PaymentStatus {
    PAID = "Paid",
    PENDING = "Pending",
    REFUND = "Refund",
    CANCELLED = "Cancelled"
}

export enum PaymentPurpose {
    FUND_DEPOSIT = "Fund Deposit",
    FUND_WITHDRAWAL = "Fund Withdrawal",
    SERVICE_PAYMENT = "Service Payment"
}