const SavingsAccount = require("../../../src/Domain/Savings_account/Entities/Savings_account");
const AccountNumber = require("../../../src/Domain/Shared/AccountNumber");
const { buildSavingsAccountData } = require("../../helpers/factories")

describe("SavingsAccount Entity", ()=> {
    const validProps = buildSavingsAccountData();
    // invariantes
    describe("Constructor and validations", ()=> {
        test("should create an valid instance with all his correct params", ()=> {
            const account = new SavingsAccount(buildSavingsAccountData());

            expect(account.id).toBe(validProps.id);
            expect(account.accountNumber.value).toBe(validProps.accountNumber.value);
            expect(account.balance).toBe(validProps.balance);
            expect(account.userId).toBe(validProps.userId);
            expect(account.isPrincipal).toBe(validProps.isPrincipal);
            expect(account.isActive).toBe(validProps.isActive);
            expect(account.adminId).toBe(validProps.adminId);

        })

        test("it should throw an error if the id is not a string", () => {
            expect(() => {
                new SavingsAccount({ ...validProps, id: 123 });
            }).toThrow();
        });

        test("it should throw an error if account number is not an instance of accountNumber_VO", ()=> {
            expect(()=> {
                new SavingsAccount({...validProps, accountNumber: "03002000335"})
            }).toThrow();
        });

        test("it should throw an error if balance is not a number", ()=> {
            expect(()=> {
                new SavingsAccount({...validProps, balance: "100"})
            }).toThrow();
        });

        test("it should throw an error if userId is not a string", ()=> {
            expect(()=> {
                new SavingsAccount({...validProps, userId: 23})
            }).toThrow();
        });

        test("it should throw an error if isPrincipal is not a boolean", ()=> {
            expect(()=> {
                new SavingsAccount({...validProps, isPrincipal: "true"})
            }).toThrow();
         })

        test("it should throw an error if isActive is not a boolean", ()=> {
            expect(()=> {
                new SavingsAccount({...validProps, isActive: "false"})
            }).toThrow();
        })

        test("it should throw an error if adminId is not a string", ()=> {
            expect(()=> {
                new SavingsAccount({...validProps, adminId: 2939})
            }).toThrow();
        })
    })


    describe("Behavior: deposit", ()=> {
        test("It should to increase the balance when a positive amount is deposited", ()=> {
            const savingAccount = new SavingsAccount(buildSavingsAccountData());
            savingAccount.deposit(500);
            expect(savingAccount.balance).toBe(6500)
        })

        test("It should throw an error if amount is less or equal than 0", ()=> {
            const savingAccount = new SavingsAccount(buildSavingsAccountData());
            expect(()=> savingAccount.deposit(-5)).toThrow();
            expect(()=> savingAccount.deposit(0)).toThrow();
        })
    })


    describe("Behavior: withDraw", ()=> {
        test("It should to decrease the balance when a positive amount is retired", ()=> {
            const savingAccount = new SavingsAccount(buildSavingsAccountData());
            savingAccount.withdraw(1000);
            expect(savingAccount.balance).toBe(5000);
        })

        test("It should throw an error if amount to retire is greater or less/equal than 0 to amount in account", ()=> {
            const savingAccount = new SavingsAccount(buildSavingsAccountData());
            expect(()=> savingAccount.withdraw(0)).toThrow();
            expect(()=> savingAccount.withdraw(-80)).toThrow();
            expect(()=> savingAccount.withdraw(10000)).toThrow();
        })
    })


    describe("Behavior: activate and deactivate of the account", ()=> {
        test("It should to active the account", ()=> {
            const savingAccount = new SavingsAccount(buildSavingsAccountData());
            savingAccount.activate();
            expect(savingAccount.isActive).toBe(true);
        })

        test("It should to deactive the account only if amount is 0", ()=> {
            const savingAccount = new SavingsAccount(buildSavingsAccountData({balance: 0}));
            savingAccount.deactivate();
            expect(savingAccount.isActive).toBe(false);
        })

        test("It should throw an error if we try to deactive account while the amount is greater than 0", ()=> {
            const savingAccount = new SavingsAccount(buildSavingsAccountData());
            expect(()=> savingAccount.deactivate()).toThrow();
        })
    })
})