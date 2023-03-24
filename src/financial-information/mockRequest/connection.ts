export const createConnectionPayload = (customerId: string) => ({
  customer_id: customerId,
  country_code: ["GB", "AE"],
  
  consent: {
    scopes: ['account_details', 'transactions_details'],
    from: "2023-01-01",
    period_days: 365,
  },
  attempt: {
    from_date: "2023-03-01",
    fetch_scopes: ['accounts', 'transactions'],
  },
  
});

export const supportedCountryPayload = [
  {
    name: 'United Arab Emirates',
    code: 'AE',
  },
  {
    name: 'United Kingdom',
    code: 'GB',
  },
];

export const connectSessionGenerator  = (customerId: string) => {
    return {
        data: {
            customer_id: customerId,
            return_connection_id: true,
            country_code: ["GB", "AE"],
            
            consent: {
              from_date: '2023-01-01',
              period_days: 365,
              scopes: ['account_details', 'transactions_details'],
            },
            attempt: {
              from_date: '2023-03-01',
              fetch_scopes: ['accounts', 'transactions'],
            }
        }
       
    }
  
};
