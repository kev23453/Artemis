const BeneficiaryMapper = require("../../../../src/Application/Beneficiary/Mappers/Beneficiary.mapper");
const CreateBeneficiaryRequestDto = require("../../../../src/Application/Beneficiary/Dtos/CreateBeneficiaryRequestDto");
const Beneficiary = require("../../../../src/Domain/Beneficiary/entities/beneficiary");
const AccountNumber = require("../../../../src/Domain/Shared/AccountNumber");
const BeneficiaryFullName = require("../../../../src/Domain/Beneficiary/value-objects/BeneficiaryFullName");
const { BuildCreateBeneficiaryData } = require("../../../helpers/factories");

describe("BeneficiaryMapper", () => {
    it("convierte un CreateBeneficiaryRequestDto en entidad Beneficiary", () => {
        const dto = new CreateBeneficiaryRequestDto(BuildCreateBeneficiaryData());

        const entity = BeneficiaryMapper.toEntity(dto);

        expect(entity).toBeInstanceOf(Beneficiary);
    });

    it("crea los value objects de nombre y cuenta", () => {
        const dto = new CreateBeneficiaryRequestDto(BuildCreateBeneficiaryData());

        const entity = BeneficiaryMapper.toEntity(dto);

        expect(entity.fullname).toBeInstanceOf(BeneficiaryFullName);
        expect(entity.fullname.getFullName()).toBe("Edgar Santana");
        expect(entity.accountNumber).toBeInstanceOf(AccountNumber);
        expect(entity.accountNumber.value).toBe("009444816");
    });

    it("copia userId y active desde el DTO", () => {
        const dto = new CreateBeneficiaryRequestDto(
            BuildCreateBeneficiaryData({ active: false })
        );

        const entity = BeneficiaryMapper.toEntity(dto);

        expect(entity.userId).toBe("d68c-5f65-2320-a83b");
        expect(entity.active).toBe(false);
    });

    it("genera un id con formato xxxx-xxxx-xxxx-xxxx", () => {
        const dto = new CreateBeneficiaryRequestDto(BuildCreateBeneficiaryData());

        const entity = BeneficiaryMapper.toEntity(dto);

        expect(entity.id).toMatch(/^[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}$/);
    });

    it("genera un id distinto en cada mapeo", () => {
        const dto = new CreateBeneficiaryRequestDto(BuildCreateBeneficiaryData());

        const first = BeneficiaryMapper.toEntity(dto);
        const second = BeneficiaryMapper.toEntity(dto);

        expect(first.id).not.toBe(second.id);
    });

    it("lanza error cuando no recibe un CreateBeneficiaryRequestDto", () => {
        expect(() => BeneficiaryMapper.toEntity(BuildCreateBeneficiaryData()))
            .toThrow("BeneficiaryMapper.toEntity expects a CreateBeneficiaryRequestDto");
    });
});
