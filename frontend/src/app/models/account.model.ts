export interface Account {
  id: number;
  accountNumber: string;
  accountType: 'SAVINGS' | 'SALARY' | 'CURRENT';
  balance: number;
  userId: number;
}

export interface CreateAccountRequest {
  userId: number;
  accountType: 'SAVINGS' | 'SALARY' | 'CURRENT';
  initialBalance: number;
  aadhaarNumber: string;
  address: string;
  state: string;
  pinCode: string;
}

export interface TransferRequest {
  fromAccount: string;
  toAccount: string;
  amount: number;
}