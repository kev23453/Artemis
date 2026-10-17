class IRefreshTokenRepository {
    // Guarda un nuevo refresh token y devuelve la entidad creada
    async create(refreshToken) { throw new Error("Method not implemented") }

    // Busca por el hash del token y devuelve RefreshToken o null
    async findByTokenHash(tokenHash) { throw new Error("Method not implemented") }

    // Marca un token como revocado y si se rota guarda el hash que lo reemplazo
    async revoke(id, { replacedByHash = null } = {}) { throw new Error("Method not implemented") }

    // Busca todos los tokens de una familia (deteccion de reutilizacion)
    async revokeFamily(familyId) { throw new Error("Method not implemented") }

    // revoca todas las sesiones de un usuario 
    async revokeAllByUser(userId) { throw new Error("Method not implemented") }
}

module.exports = IRefreshTokenRepository;