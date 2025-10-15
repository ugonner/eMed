export const ServiceDurations = {
  "15Minutes": 900000,
  "30Minutes": 1800000,
  "45Minutes": 2700000,
  "1Hour": 3600000,
  "2Hours": 7200000,
  "4Hours": 14400000,
  "6Hours": 21600000,
  "8Hours": 28800000,
  "10Hours": 36000000,
  "12Hours": 43200000,
  "1Day": 86400000,
  "2Days": 172800000,
  "1Week": 604800000
};
export const formatServiceDurationKey = (key: string): string => {
    return key.replace(/(\d+)/i, "$1 ");
}