import { briefcase, informationSharp, square, timeSharp } from "ionicons/icons";
import { formatCamelCaseToSentence } from "../../shared/helpers";
import { IPaymentTransaction } from "../interfaces/payment";
import { formatCurrency } from "../../utils";

export interface IPaymenTransactonFieldsItem {
    name: string;
    value: unknown;
    icon?: string;
    label?: string;
}

export const getTransactionFields = (trx: IPaymentTransaction): IPaymenTransactonFieldsItem[] => {
    return [
        {
            name: "Purpose",
            value: formatCamelCaseToSentence(trx.paymentPurpose),
            label: "Purpose",
            icon: square
        },
        {
            name: "Payment Status",
            value: trx.paymentStatus,
            label: "Payment status",
            icon: informationSharp
        },
        {
            name: "Amount",
            value: formatCurrency(trx.amount),
            label: "Amount",
            icon: briefcase
        },
        {
            name: `Initiated At`,
            value: `${trx.createdAt?.split(".")[0]?.replace("T", ", ")}`,
            label: "Initiated At",
            icon: timeSharp
        },
        {
            name: "Payment Method",
            value: trx.paymentMethod,
            label: "Payment method",
            icon: briefcase
        }


    ]
}