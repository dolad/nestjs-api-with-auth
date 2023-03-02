export const createConnectionPayload = {
  customer_id: 'Your_Customer_id_from_customer',
  country_code: 'XF',
  provider_code: 'fakebank_simple_xf',
  consent: {
    scopes: ['account_details', 'transactions_details'],
  },
  attempt: {
    fetch_scopes: ['accounts', 'transactions'],
  },
  credentials: {
    login: 'username',
    password: 'secret',
  },
};

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
            include_fake_providers: true,
            consent: {
              from_date: '2023-01-01',
              period_days: 90,
              scopes: ['account_details', 'transactions_details'],
            },
            attempt: {
              from_date: '2023-03-01',
              fetch_scopes: ['accounts', 'transactions'],
            }
        }
       
    }
  
};
