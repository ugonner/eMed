
export interface IQuickLinkItem {
  id: number;
  icon: string;
  text:
    | "Book A Service"
    | "Call Live Providers"
    | "Call A Service"
    | "Provide Service";
  ariaLabel?: string;
  backgroundColor?: string;
}
