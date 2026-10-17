class RefreshToken {
    constructor({
        id,
        userId,
        tokenHash,
        familyId,
        expiresAt,
        revokedAt=null,
        replacedByHash=null,
        createdAt=new Date()
    })
    {
        this.id = id;
        this.userId = userId;
        this.tokenHash = tokenHash; // nunca guardar token sin hashear usar SHA-256
        this.familyId = familyId; // agrupa todos los tokens de una misma sesion
        this.expiresAt = expiresAt;
        this.revokedAt = revokedAt; // null = aun no ha sido revocado
        this.replacedByHash = replacedByHash; // hash del token que lo reemplazo al rotar
        this.createdAt = createdAt;
    }

    isExpired(now = new Date()) {
        // devuelve un booleano en base a la comparacion de las fechas indicando si el token expiro (true) o no (false)
        return this.expiresAt <= now;
    }

    isRevoked() {
        // comprueba si el token ha sido revocado (null)
        return this.revokedAt !== null;
    }

    isActive(now = new Date()) {
        // comprueba que el token no haya sido revokado ni expirado lo cual indica que aun sigue activo
        return !this.isRevoked() && !this.isExpired(now);
    }
}

module.exports = RefreshToken;