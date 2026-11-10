const CreateSavingsAccountMapper = require("../../../../src/Application/Savings_account/Mappers/CreateSavingsAccountMapper");
const CreateSavingsAccountRequestDto = require("../../../../src/Application/Savings_account/Dtos/CreateSavingsAccountRequestDto");
const SavingsAccount = require("../../../../src/Domain/Savings_account/Entities/Savings_account");
const AccountNumber = require("../../../../src/Domain/Shared/AccountNumber");
const { buildCreateSavingsAccountData } = require("../../../helpers/factories");

const ID = "9999-0000-1111-2222";

describe("CreateSavingsAccountMapper", () => {
    it("convierte un CreateSavingsAccountRequestDto en entidad SavingsAccount", () => {
        const dto = new CreateSavingsAccountRequestDto(buildCreateSavingsAccountData());

        const entity = CreateSavingsAccountMapper.toEntity(dto, ID);

        expect(entity).toBeInstanceOf(SavingsAccount);
    });

    it("crea el value object AccountNumber a partir del string del DTO", () => {
        const dto = new CreateSavingsAccountRequestDto(buildCreateSavingsAccountData());

        const entity = CreateSavingsAccountMapper.toEntity(dto);

        expect(entity.accountNumber).toBeInstanceOf(AccountNumber);
        expect(entity.accountNumber.value).toBe("259984125");
    });

    it("copia balance, userId, estados y adminId desde el DTO", () => {
        const dto = new CreateSavingsAccountRequestDto(
            buildCreateSavingsAccountData({
                balance: 1500.5,
                userId: "user-1",
                isPrincipal: false,
                isActive: false,
                adminId: "admin-1"
            })
        );

        const entity = CreateSavingsAccountMapper.toEntity(dto, ID);

        expect(entity.balance).toBe(1500.5);
        expect(entity.userId).toBe("user-1");
        expect(entity.isPrincipal).toBe(false);
        expect(entity.isActive).toBe(false);
        expect(entity.adminId).toBe("admin-1");
    });

    it("genera createdAt por defecto cuando no se recibe", () => {
        const dto = new CreateSavingsAccountRequestDto(buildCreateSavingsAccountData());

        const entity = CreateSavingsAccountMapper.toEntity(dto, ID);

        expect(entity.createdAt).toBeInstanceOf(Date);
    });

    it("lanza error cuando no recibe un CreateSavingsAccountRequestDto", () => {
        expect(() => CreateSavingsAccountMapper.toEntity(buildCreateSavingsAccountData(), ID))
            .toThrow("CreateSavingsAccountMapper.toEntity expects a CreateSavingsAccountRequestDto");
    });
});
