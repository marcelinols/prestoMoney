
export const addUser = (user) => ({
    type: 'add_user',
    payload: user
});

export const allUsers = (users) => ({
    type: 'all_users',
    payload: users
})

export const addInvestment = (investment) => ({
    type: 'add_investment',
    payload: investment,
})

export const allInvestment = (investments) => ({
    type: 'all_investment',
    payload: investments
})

export const addLoan = (loan) => ({
    type: 'add_loan',
    payload: loan,
})

export const allLoans = (loans) => ({
    type: 'all_loans',
    payload: loans
})

