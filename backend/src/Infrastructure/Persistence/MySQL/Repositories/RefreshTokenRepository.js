const { Op, where } = require("sequelize"); 
const IRefreshTokenRepository = require("../../../../Domain/Users/Repositories/RefreshTokenRepository");
const RefreshToken = require("../../../../Domain/Users/Entities/RefreshToken");

class RefreshTokenRepository extends IRefreshTokenRepository {
    constructor( { RefreshTokenModel } ) {
        super();
        this.model = RefreshTokenModel;
    }

    async create(refreshToken) {
        const row = await this.model.create({
            userId: refreshToken.userId ,
            tokenHash: refreshToken.tokenHash,
            familyId: refreshToken.familyId,
            expiresAt: refreshToken.expiresAt
        });
        return this.#toEntity(row);
    }

    async findByTokenHash(tokenHash) {
        const row = await this.model.findOne({where: { tokenHash } });
        return row ? this.#toEntity(row) : null;
    }


    async revoke(id, { replacedByHash = null } = {}) {
        await this.model.update(
            { revokedAt: new Date(), replacedByHash },
            { where: { id, revokedAt: null } }
        )
    }

    async revokeFamily(familyId) {
        await this.model.update(
            { revokedAt: new Date() },
            { where: { familyId, revokedAt: null } }
        )
    }

    async revokeAllByUser(userId) {
        await this.model.update(
            { revokedAt: new Date() },
            { where: { userId, revokedAt: null } }
        )
    }

    // eliminar los refresh tokens que han vencido y tienen mas de un mes en inactividad
    async deletedExpiredTokens(olderThanDays = 30) {
        const limit = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
        return this.model.destroy( { where: { expiresAt: { [Op.lt]: limit } } } );
    }



    #toEntity(row) {
        return new RefreshToken({
            id: row.id,
            userId: row.userId,
            tokenHash: row.tokenHash,
            familyId: row.familyId,
            expiresAt: row.expiresAt,
            revokedAt: row.revokedAt,
            replacedByHash: row.replacedByHash,
            createdAt: row.createdAt,
        });
    }
}

module.exports = RefreshTokenRepository;