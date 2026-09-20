# ARTEMIS BANKING

**Documento de visión, requisitos, historias de usuario, casos de uso y plan de desarrollo**

Tipo de documento: Software Requirements & Product Specification
Versión: 2.0
Estado: Base para diseño, desarrollo e implementación
Stack objetivo: Node.js + TypeScript · MySQL · Redis · React + TypeScript · Docker

---

## Propósito

Definir una plataforma de banca en línea capaz de gestionar de forma integral **préstamos, tarjetas de crédito y cuentas de ahorro**, procesar **pagos, transferencias, avances de efectivo y consumos en comercios**, y exponer una **API REST** para la administración programática y para el procesador de pagos de comercios (**Hermes Pay**), todo bajo un esquema de seguridad basado en roles.

## Visión del producto

Artemis Banking no es un CRUD de cuentas. Es un **sistema transaccional**: cada operación mueve dinero real entre productos, deja rastro en un historial auditable, notifica a las partes involucradas y debe quedar consistente incluso cuando falla a mitad de camino.

Cuatro ideas gobiernan todo el diseño:

1. **El dinero nunca se crea ni se destruye.** Toda operación que afecta un balance genera uno o más registros de transacción que explican de dónde salió y a dónde llegó.
2. **Nada se ejecuta sin validación previa.** Fondos, existencia del producto, estado activo y límites se validan *antes* de tocar un balance.
3. **Atomicidad o nada.** Una operación que toca dos balances se aplica completa o no se aplica.
4. **El dominio no conoce la infraestructura.** El cálculo de una cuota de amortización no sabe que existe MySQL, Redis ni un proveedor SMTP.

---

## 1. Alcance del producto

| Dominio | Descripción |
|---|---|
| Identidad y seguridad | Registro, login, activación por correo, reseteo de contraseña, roles, JWT, refresh tokens |
| Gestión de usuarios | Administradores, cajeros, clientes y comercios; alta, edición, activación/inactivación |
| Cuentas de ahorro | Cuenta principal y secundarias, balances, cancelación, historial de movimientos |
| Préstamos | Asignación, evaluación de riesgo, tabla de amortización francesa, edición de tasa |
| Tarjetas de crédito | Emisión, límite, CVC hasheado, consumos, deuda, cancelación |
| Transacciones | Express, a beneficiarios, entre cuentas propias, pagos a TC y préstamos |
| Beneficiarios | Libreta de cuentas frecuentes del cliente |
| Avances de efectivo | Retiro desde TC hacia cuenta de ahorro con interés del 6.25% |
| Operación de caja | Depósitos, retiros, pagos y transferencias a terceros realizados por el cajero |
| Comercios | Registro de comercios y su usuario asociado |
| Hermes Pay | Procesamiento de cobros con tarjeta de crédito por parte de comercios |
| Notificaciones | Correos transaccionales por cada operación relevante |
| Jobs programados | Marcado diario de cuotas atrasadas |
| Dashboards | Indicadores para administrador y cajero |

## 2. Objetivos

- Administrar el ciclo de vida completo de los productos financieros de cada cliente.
- Garantizar que ningún balance quede inconsistente tras una operación fallida.
- Registrar trazabilidad completa (origen, beneficiario, tipo, estado) de cada movimiento.
- Impedir el acceso cruzado entre roles y entre datos de distintos clientes.
- Evaluar el riesgo crediticio antes de asignar un préstamo.
- Notificar por correo cada movimiento que afecte el dinero del cliente.
- Permitir que la infraestructura cambie (MySQL → otro motor, SMTP → otro proveedor) sin reescribir casos de uso.

## 3. Actores y roles

| Actor | Superficie | Descripción |
|---|---|---|
| **Administrador** | Web + API | Gestiona usuarios, préstamos, tarjetas, cuentas y comercios. Ve el dashboard global. |
| **Cajero** | Web | Ejecuta depósitos, retiros, pagos y transferencias a terceros sobre cuentas de clientes. |
| **Cliente** | Web | Consulta sus productos y ejecuta transacciones, avances y transferencias. |
| **Comercio** | API | Consulta las transacciones recibidas y procesa cobros con tarjeta vía Hermes Pay. |
| **Sistema (Jobs)** | Backend | Marca cuotas atrasadas de forma programada. |

**Reglas de aislamiento:**

- Sin sesión activa no se accede a ninguna funcionalidad: la UI redirige al login con el mensaje *"No tiene permiso para acceder a esta sección"*; la API responde **401**.
- Cliente ⇎ Administrador ⇎ Cajero: ningún rol accede a las áreas de otro. La UI muestra **"Acceso denegado"** con enlace al Home del rol; la API responde **403**.
- Un cliente nunca puede leer ni operar productos que no le pertenecen, aunque conozca su identificador.

---

# 4. Stack tecnológico

| Área | Componente |
|---|---|
| Lenguaje backend | Node.js 20+ con **TypeScript** (modo estricto) |
| Framework HTTP | Express (o Fastify) + `express-async-errors` |
| Base de datos | **MySQL 8** |
| ORM / acceso a datos | Prisma (recomendado) o TypeORM — confinado a la capa de infraestructura |
| Cache y colas | **Redis** (cache selectivo, rate limiting, sesiones de refresh token) |
| Jobs | **BullMQ** sobre Redis + workers dedicados |
| Autenticación | JWT (access + refresh), `argon2` o `bcrypt` para contraseñas |
| Validación | **Zod** en los bordes (DTOs de entrada) |
| Correo | **Nodemailer** sobre SMTP (Mailtrap/Ethereal en desarrollo) |
| Documentación API | **OpenAPI 3 / Swagger UI** |
| Frontend | **React 18 + TypeScript + Vite**, React Router, TanStack Query, React Hook Form + Zod, Tailwind o Bootstrap |
| Contenedores | **Docker + Docker Compose** (api, worker, mysql, redis, web) |
| CI/CD | GitHub Actions |
| Testing | Vitest (o Jest) + Supertest + Testcontainers para integración |
| Observabilidad | Logs estructurados (Pino), request ID, health checks |
| Precisión monetaria | `decimal.js` en el dominio · `DECIMAL(18,2)` en MySQL · **nunca** `float` ni `number` para montos |

> **Nota crítica sobre dinero en JavaScript:** el tipo `number` de JS es punto flotante de doble precisión y produce errores de centavo. Todos los montos se modelan con un Value Object `Money` respaldado por `decimal.js` (o enteros en centavos), y se serializan como *string* en los DTOs de la API.

---

# 5. Arquitectura propuesta

Clean Architecture con cuatro capas y las dependencias apuntando siempre hacia el dominio.

```
┌──────────────────────────────────────────────────────────┐
│  Presentación                                            │
│  Routers · Controllers · Middlewares · Swagger           │
├──────────────────────────────────────────────────────────┤
│  Infraestructura                                         │
│  Prisma/MySQL · Redis · BullMQ · Nodemailer · Hashing    │
├──────────────────────────────────────────────────────────┤
│  Aplicación                                              │
│  Use cases · DTOs · Mappers · Validators · Errores       │
├──────────────────────────────────────────────────────────┤
│  Dominio                                                 │
│  Entidades · Value Objects · Puertos (interfaces) · Enums│
└──────────────────────────────────────────────────────────┘

Presentación → Infraestructura → Aplicación → Dominio
```

## 5.1 Estructura del repositorio

```
artemis/
├── docker-compose.yml
├── packages/
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── src/
│   │       ├── domain/
│   │       │   ├── entities/        (User, SavingsAccount, CreditCard, Loan, ...)
│   │       │   ├── value-objects/   (Money, AccountNumber, CardNumber, Cvc, ...)
│   │       │   ├── enums/
│   │       │   ├── errors/          (DomainError y subclases)
│   │       │   └── ports/           (IUserRepository, IEmailSender, IHasher, IUnitOfWork)
│   │       │
│   │       ├── application/
│   │       │   ├── use-cases/
│   │       │   │   ├── auth/        (LoginUseCase, ConfirmAccountUseCase, ...)
│   │       │   │   ├── users/
│   │       │   │   ├── accounts/
│   │       │   │   ├── loans/
│   │       │   │   ├── cards/
│   │       │   │   ├── transactions/
│   │       │   │   ├── teller/
│   │       │   │   ├── commerce/
│   │       │   │   └── hermes-pay/
│   │       │   ├── dtos/
│   │       │   ├── mappers/
│   │       │   ├── validators/      (esquemas Zod)
│   │       │   └── errors/          (ApplicationError)
│   │       │
│   │       ├── infrastructure/
│   │       │   ├── persistence/     (PrismaClient, repositorios, UnitOfWork)
│   │       │   ├── cache/           (RedisCache)
│   │       │   ├── queue/           (BullMQ: queues, workers, schedulers)
│   │       │   ├── email/           (NodemailerSender, plantillas)
│   │       │   ├── security/        (Argon2Hasher, JwtService, Sha256Hasher)
│   │       │   └── config/          (env con Zod, logger)
│   │       │
│   │       ├── presentation/
│   │       │   ├── routes/
│   │       │   ├── controllers/
│   │       │   ├── middlewares/     (auth, requireRole, errorHandler, rateLimit)
│   │       │   └── docs/            (OpenAPI)
│   │       │
│   │       ├── app.ts               (registro de rutas, middlewares, errores)
│   │       ├── server.ts            (puerto y arranque)
│   │       ├── bootstrap.ts         (composition root: inyección de dependencias)
│   │       └── worker.ts            (arranque de workers BullMQ)
│   │
│   └── web/                         (React + Vite)
│       └── src/
│           ├── app/                 (router, providers, layouts por rol)
│           ├── features/
│           │   ├── auth/
│           │   ├── admin/           (users, loans, cards, accounts, dashboard)
│           │   ├── teller/
│           │   └── client/          (home, transactions, beneficiaries, advance)
│           ├── shared/              (api client, hooks, componentes, formatters)
│           └── main.tsx
```

**Separación de inicio (backend):**

- **`app.ts`** — construye la aplicación: registra rutas, middlewares, manejo de errores.
- **`server.ts`** — configura el puerto y levanta el servidor. Es el archivo que se ejecuta.
- **`bootstrap.ts`** — **composition root**: aquí se instancian las implementaciones concretas (PrismaUserRepository, NodemailerSender, RedisCache…) y se inyectan en los casos de uso. Es el único lugar del backend donde se decide *qué* infraestructura se usa.

**Reglas de dependencia (no negociables):**

- `domain/` no importa **nada** de las otras capas ni de librerías de infraestructura.
- `application/` importa solo de `domain/`.
- `infrastructure/` implementa los puertos de `domain/` y puede importar de `application/`.
- `presentation/` recibe casos de uso ya construidos; **nunca** instancia un repositorio ni contiene reglas de negocio.
- Ningún controlador conoce Prisma.

## 5.2 Superficies de la API

Un solo backend expone dos superficies con el mismo motor de dominio:

| Superficie | Prefijo | Roles | Consumidor |
|---|---|---|---|
| Plataforma | `/api/...` | Administrador, Cajero, Cliente | Frontend React |
| Partners | `/pay/...` | Administrador, Comercio | Integraciones de comercios (Hermes Pay) |

---

# 6. Historias de usuario

Formato: `US-XX · Como <rol> quiero <capacidad> para <beneficio>` + criterios de aceptación.

## Épica 1 — Identidad y seguridad

**US-01 · Iniciar sesión**
Como usuario del sistema quiero autenticarme con usuario y contraseña para acceder a las funciones de mi rol.
- Dado credenciales válidas y cuenta activa, recibo acceso y aterrizo en el Home de mi rol.
- Dado credenciales inválidas, veo un mensaje de datos de acceso incorrectos.
- Dado una cuenta inactiva, se rechaza el login y se me indica que debo activarla mediante el enlace enviado a mi correo.
- Dado que ya estoy autenticado e intento abrir el login, soy redirigido automáticamente a mi Home.

**US-02 · Cerrar sesión**
Como usuario quiero cerrar sesión para proteger mi cuenta al terminar. Se elimina la sesión y se redirige al login.

**US-03 · Activar mi cuenta**
Como usuario recién creado quiero activar mi cuenta desde el correo que recibí para poder iniciar sesión.
- El correo contiene un enlace con un token; al abrirlo, mi cuenta queda activa.
- Un token ya usado o inválido no activa nada y muestra un error.

**US-04 · Restablecer mi contraseña**
Como usuario que olvidó su contraseña quiero restablecerla para recuperar el acceso.
- Ingreso mi nombre de usuario; si existe, mi cuenta se inactiva y recibo un correo con un enlace con token.
- El formulario pide contraseña y confirmación, ambas requeridas y coincidentes.
- Al guardarla, mi cuenta se reactiva y soy enviado al login.

**US-05 · Protección de rutas por rol**
Como banco quiero que cada rol acceda solo a lo suyo para evitar accesos indebidos.
- Sin sesión → redirección al login con el mensaje correspondiente (API: 401).
- Rol incorrecto → pantalla de acceso denegado con enlace a mi Home (API: 403).

## Épica 2 — Gestión de usuarios (Administrador)

**US-06 · Listar usuarios**
Quiero ver todos los usuarios (excepto los de rol comercio), del más reciente al más antiguo, paginados de 20 en 20, con usuario, cédula, nombre, apellido, correo, tipo y estado.

**US-07 · Filtrar usuarios por rol**
Quiero un selector para ver solo administradores, cajeros o clientes.

**US-08 · Crear un usuario**
Quiero crear administradores, cajeros o clientes.
- Todos los campos son obligatorios excepto el monto inicial.
- Usuario y correo deben ser únicos; si no, se rechaza.
- Si el tipo es cliente, aparece el campo **Monto inicial** y se crea automáticamente su cuenta de ahorro **principal** con número único de 9 dígitos y ese balance.
- El usuario se crea inactivo y recibe el correo de activación.

**US-09 · Editar un usuario**
Quiero editar nombre, apellido, cédula, correo, usuario y contraseña; el tipo de usuario no se puede cambiar. Para clientes hay un campo **Monto adicional** que se suma al balance de su cuenta principal.

**US-10 · Activar o inactivar un usuario**
Quiero cambiar el estado de un usuario con confirmación previa, y no debo poder modificar mi propia cuenta.

## Épica 3 — Cuentas de ahorro (Administrador)

**US-11 · Listar cuentas de ahorro**
Quiero ver todas las cuentas activas (principales y secundarias) con número, cliente, balance y tipo, paginadas de 20 en 20.

**US-12 · Buscar y filtrar cuentas**
Quiero buscar por cédula (activas primero, luego canceladas) y filtrar por estado y por tipo.

**US-13 · Asignar una cuenta secundaria**
Quiero seleccionar un cliente activo y crear una cuenta secundaria con un balance inicial que puede ser 0, con número único de 9 dígitos.

**US-14 · Ver el historial de una cuenta**
Quiero ver sus transacciones de la más reciente a la más antigua, con fecha, monto, tipo, beneficiario, origen y estado.

**US-15 · Cancelar una cuenta secundaria**
Quiero cancelar una cuenta secundaria; su saldo se transfiere automáticamente a la cuenta principal del cliente y la cuenta deja de aceptar operaciones. Las cuentas principales no se pueden cancelar.

## Épica 4 — Préstamos (Administrador)

**US-16 · Listar préstamos**
Quiero ver los préstamos activos con número, cliente, capital, cuotas totales, cuotas pagadas, pendiente, tasa, plazo e indicador de al día / en mora.

**US-17 · Buscar y filtrar préstamos**
Quiero buscar por cédula y filtrar por estado (activos / completados).

**US-18 · Seleccionar cliente para préstamo**
Quiero ver solo clientes activos sin préstamo activo, con la deuda promedio del sistema visible y buscador por cédula, y seleccionar uno.

**US-19 · Configurar y asignar el préstamo**
Quiero definir plazo (6 a 60 meses en intervalos de 6), monto y tasa anual, y confirmar la asignación.

**US-20 · Ser advertido del riesgo del cliente**
Quiero que el sistema me advierta si el cliente ya es de alto riesgo o si lo será con este préstamo, y me pida confirmación explícita antes de continuar.

**US-21 · Recibir la tabla de amortización generada**
Quiero que al crear el préstamo se genere automáticamente la tabla con cuota constante (sistema francés) y vencimientos mensuales a partir del mes siguiente.

**US-22 · Ver el detalle de un préstamo**
Quiero ver su tabla de amortización con fecha, valor, estado de pago e indicador de atraso.

**US-23 · Editar la tasa de interés**
Quiero cambiar la tasa anual; solo se recalculan las cuotas futuras, y el cliente recibe un correo con la nueva tasa y la nueva cuota.

## Épica 5 — Tarjetas de crédito (Administrador)

**US-24 · Listar tarjetas**
Quiero ver las tarjetas activas con número, cliente, límite, expiración MM/AA y monto adeudado.

**US-25 · Buscar y filtrar tarjetas**
Quiero buscar por cédula (activas primero, luego canceladas) y filtrar por estado.

**US-26 · Asignar una tarjeta**
Quiero seleccionar un cliente activo y definir el límite de crédito; el sistema genera número de 16 dígitos único, CVC de 3 dígitos hasheado y expiración a 3 años.

**US-27 · Ver consumos de una tarjeta**
Quiero ver fecha, monto, comercio (o "AVANCE") y estado APROBADO/RECHAZADO.

**US-28 · Editar el límite**
Quiero modificar el límite siempre que no quede por debajo de la deuda actual; el cliente recibe un correo con el nuevo límite y los últimos 4 dígitos.

**US-29 · Cancelar una tarjeta**
Quiero cancelar una tarjeta solo si su deuda es cero; al cancelarla, deja de aceptar consumos y desaparece de los productos del cliente.

## Épica 6 — Dashboards

**US-30 · Dashboard del administrador**
Quiero ver transacciones totales y del día, pagos del día y totales, clientes activos e inactivos, productos asignados, préstamos vigentes, tarjetas emitidas, cuentas abiertas y deuda promedio por cliente.

**US-31 · Dashboard del cajero**
Quiero ver, del día y de mí mismo, el total de transacciones, de pagos, de depósitos y de retiros.

## Épica 7 — Cliente: productos

**US-32 · Ver mis productos**
Como cliente quiero ver mis cuentas activas (principal primero, secundarias descendente por balance), mis préstamos activos y mis tarjetas activas; las secciones sin productos no se muestran.

**US-33 · Ver el detalle de mi cuenta**
Quiero ver el historial de movimientos de cada cuenta con origen, beneficiario, tipo y estado.

**US-34 · Ver el detalle de mi préstamo**
Quiero ver mi tabla de amortización y saber qué cuotas están pagadas o atrasadas.

**US-35 · Ver el detalle de mi tarjeta**
Quiero ver mis consumos, el comercio y si fueron aprobados o rechazados.

## Épica 8 — Cliente: operaciones

**US-36 · Registrar beneficiarios**
Quiero guardar cuentas frecuentes por número de cuenta para no escribirlas cada vez; si la cuenta no existe, recibo un mensaje de error.

**US-37 · Eliminar un beneficiario**
Quiero eliminarlos con confirmación previa.

**US-38 · Transferencia express**
Quiero transferir a cualquier cuenta escribiendo su número, viendo antes el nombre del titular destino y confirmando.
- Cuenta inexistente o inactiva → operación cancelada con mensaje.
- Fondos insuficientes → operación cancelada con mensaje.
- Al confirmar: débito en origen, crédito en destino y correo a ambas partes.

**US-39 · Transferencia a beneficiario**
Quiero transferir a un beneficiario guardado con el mismo flujo de confirmación y notificaciones.

**US-40 · Transferencia entre mis cuentas**
Quiero mover dinero entre mis propias cuentas; origen y destino no pueden ser la misma cuenta.

**US-41 · Pagar mi tarjeta de crédito**
Quiero pagar desde una de mis cuentas; si pago más que la deuda, solo se debita la deuda.

**US-42 · Pagar mi préstamo**
Quiero abonar a mi préstamo; el monto se aplica secuencialmente a las cuotas pendientes y el excedente final vuelve a mi cuenta.

**US-43 · Avance de efectivo**
Quiero pasar dinero de mi tarjeta a mi cuenta de ahorro; el sistema valida el crédito disponible y agrega un 6.25% de interés a la deuda.

## Épica 9 — Cajero

**US-44 · Depósito**
Como cajero quiero depositar a una cuenta por su número, confirmando el titular, con registro de crédito y correo al cliente.

**US-45 · Retiro**
Quiero retirar de una cuenta validando existencia y fondos, con registro de débito y correo al cliente.

**US-46 · Pago a tarjeta de crédito**
Quiero pagar una tarjeta (16 dígitos) desde una cuenta, con la regla de no sobrepago.

**US-47 · Pago a préstamo**
Quiero pagar un préstamo (9 dígitos) desde una cuenta, con aplicación secuencial a cuotas y devolución del excedente.

**US-48 · Transacción a cuentas de terceros**
Quiero mover dinero entre dos cuentas cualesquiera, con registro cruzado y correo a ambas partes.

## Épica 10 — Comercios y Hermes Pay

**US-49 · Administrar comercios**
Como administrador quiero crear, consultar, editar y activar/desactivar comercios; al desactivar uno, sus usuarios se desactivan, y al reactivarlo siguen inactivos hasta resetear contraseña.

**US-50 · Crear el usuario de un comercio**
Quiero crear el usuario de un comercio (uno solo por comercio) con su cuenta de ahorro principal asociada.

**US-51 · Consultar mis cobros**
Como comercio quiero ver las transacciones recibidas en mi cuenta principal, paginadas.

**US-52 · Procesar un cobro con tarjeta**
Como comercio quiero cobrar con los datos de una tarjeta; el sistema valida número, expiración, CVC y crédito disponible, acredita mi cuenta, registra el consumo y notifica a ambas partes.

## Épica 11 — Sistema

**US-53 · Marcado automático de cuotas atrasadas**
Como sistema quiero revisar diariamente las cuotas no pagadas con fecha vencida y marcarlas como atrasadas, para que el estado de mora del cliente sea siempre real. El proceso es idempotente.

**US-54 · Notificación de cada movimiento**
Como cliente quiero recibir un correo por cada operación que afecte mi dinero, con monto, identificador enmascarado y fecha y hora exacta.

---

# 7. Casos de uso

Formato: actor, precondiciones, flujo principal, flujos alternativos, postcondiciones.

## CU-01 · Iniciar sesión
**Actor:** cualquier usuario · **Precondición:** usuario registrado

1. El actor envía usuario y contraseña.
2. El sistema busca el usuario por nombre de usuario.
3. Verifica la contraseña contra el hash almacenado.
4. Verifica que el usuario esté **activo**.
5. Emite access token (JWT) y refresh token y devuelve el rol.
6. El frontend redirige al Home del rol.

**Alternativos:**
- 2a. Usuario inexistente → mensaje de datos de acceso incorrectos (API 401).
- 3a. Contraseña incorrecta → mismo mensaje; se incrementa el contador de intentos (rate limit en Redis).
- 4a. Usuario inactivo → mensaje indicando que debe activar su cuenta mediante el enlace enviado a su correo.

**Postcondición:** sesión establecida.

## CU-02 · Activar cuenta
**Actor:** usuario nuevo · **Precondición:** usuario creado e inactivo, token emitido

1. El actor abre el enlace del correo con el token (o envía el token a la API).
2. El sistema valida el token: existe, no está usado y no expiró.
3. Marca el usuario como activo y consume el token.

**Alternativos:** 2a. Token inválido, usado o expirado → error 400 sin cambios.
**Postcondición:** usuario activo.

## CU-03 · Restablecer contraseña
**Actor:** usuario · **Precondición:** ninguna

1. El actor envía su nombre de usuario.
2. El sistema verifica que exista.
3. **Inactiva** al usuario.
4. Genera un token de reseteo con expiración y lo asocia al usuario.
5. Envía correo: **enlace con token** en la web, **token en el cuerpo** en la API.
6. El actor envía nueva contraseña y confirmación.
7. El sistema valida campos requeridos, coincidencia y vigencia del token.
8. Guarda la nueva contraseña, **reactiva** al usuario y consume el token.

**Alternativos:**
- 2a. Usuario inexistente → error, no se envía correo ni se inactiva a nadie.
- 7a. Contraseñas no coinciden o token inválido → error sin cambios.

**Postcondición:** contraseña actualizada y usuario activo.

## CU-04 · Crear usuario
**Actor:** administrador

1. El administrador envía los datos del usuario y el tipo.
2. El sistema valida campos obligatorios (todos excepto monto inicial).
3. Valida unicidad de **usuario** y **correo**.
4. Crea el usuario **inactivo** con el rol indicado.
5. **Si es cliente:** genera un número de 9 dígitos único (no usado por cuentas ni préstamos) y crea su cuenta de ahorro **principal** con balance = monto inicial.
6. Genera token de activación y envía el correo.

**Alternativos:**
- 3a. Usuario o correo duplicado → 409 sin crear nada.
- 5a. Colisión de número → se regenera hasta obtener uno libre.

**Postcondición:** usuario inactivo creado; si es cliente, con cuenta principal.

## CU-05 · Editar usuario
**Actor:** administrador

1. Envía los datos a modificar.
2. El sistema verifica que el usuario exista y que **no sea el propio administrador autenticado**.
3. Valida unicidad de usuario y correo contra los demás registros.
4. Actualiza los datos; si se envió contraseña, la rehashea.
5. Si es cliente y se envió **monto adicional**, lo suma al balance de la cuenta principal y registra la transacción de crédito correspondiente.

**Alternativos:** 2a. Auto-modificación → 403. 3a. Duplicado → 409.
**Postcondición:** usuario actualizado.

## CU-06 · Cambiar estado de usuario
**Actor:** administrador

1. Solicita activar o inactivar a un usuario, con confirmación previa en la UI.
2. El sistema verifica que no sea su propia cuenta.
3. Actualiza el estado.

**Alternativos:** 2a. Propia cuenta → 403. Cancelación en la UI → no se ejecuta nada.

## CU-07 · Asignar cuenta de ahorro secundaria
**Actor:** administrador

1. Selecciona un cliente activo del listado (radio, uno a la vez) y avanza.
2. Ingresa el balance inicial (puede ser 0) y confirma.
3. El sistema genera un número único de 9 dígitos.
4. Crea la cuenta como **secundaria** y **activa**, registrando al administrador responsable y la fecha de creación.

**Postcondición:** cuenta secundaria creada.

## CU-08 · Cancelar cuenta de ahorro
**Actor:** administrador · **Precondición:** la cuenta es secundaria y está activa

1. Solicita la cancelación; el sistema muestra *"¿Está seguro que desea cancelar la cuenta [XXXXXXXXX]?"*.
2. Al aceptar, el sistema abre una transacción de base de datos.
3. Si la cuenta tiene balance, lo transfiere íntegro a la cuenta principal del cliente y deja la cuenta en cero, registrando débito y crédito.
4. Marca la cuenta como **cancelada** y confirma la transacción.

**Alternativos:** 1a. La cuenta es principal → la acción no se ofrece. 1b. El usuario cancela → sin cambios.
**Postcondición:** cuenta cancelada, saldo preservado en la principal.

## CU-09 · Asignar préstamo
**Actor:** administrador · **Precondición:** existe al menos un cliente activo sin préstamo activo

1. El administrador abre el listado de candidatos, que muestra la **deuda promedio del sistema**.
2. Selecciona un cliente y avanza al paso de configuración.
3. Ingresa plazo (múltiplo de 6, entre 6 y 60), monto y tasa anual, y confirma.
4. El sistema valida los campos y que el cliente siga sin préstamo activo.
5. Calcula la cuota con el sistema francés y el total de intereses.
6. **Evalúa el riesgo** (ver CU-10). Si aplica, exige confirmación adicional.
7. Abre una transacción de base de datos y:
   a. Genera el número de préstamo (9 dígitos únicos).
   b. Crea el préstamo activo con cliente, capital, plazo, tasa y administrador responsable.
   c. Genera la tabla de amortización completa.
   d. Suma el capital al balance de la cuenta principal del cliente.
   e. Registra una transacción de **crédito** en esa cuenta con el número de préstamo como **origen**.
8. Confirma la transacción, envía el correo de aprobación y redirige al listado de préstamos.

**Alternativos:**
- 4a. El cliente ya tiene un préstamo activo → 400, no se crea nada.
- 6a. El administrador cancela en la advertencia → se aborta y se vuelve al listado (API: 409).
- 7x. Cualquier fallo → rollback completo; ningún balance cambia.

**Postcondición:** préstamo activo, tabla generada y capital desembolsado.

## CU-10 · Evaluar riesgo del cliente
**Actor:** sistema (invocado por CU-09)

1. Calcula la **deuda promedio** = deuda total de clientes activos ÷ cantidad de clientes activos.
2. Obtiene la deuda actual del cliente.
3. Si `deudaActual > promedio` → riesgo **YA_ALTO**: *"Este cliente se considera de alto riesgo, ya que su deuda actual supera el promedio del sistema"*.
4. Si no, calcula `deudaActual + capital + intereses totales`; si supera el promedio → riesgo **SE_VUELVE_ALTO**: *"Asignar este préstamo convertirá al cliente en un cliente de alto riesgo, ya que su deuda superará el umbral promedio del sistema"*.
5. En cualquier otro caso → **SIN_RIESGO**: se continúa sin advertencia.

**Postcondición:** decisión de riesgo devuelta al flujo llamante.

## CU-11 · Generar tabla de amortización
**Actor:** sistema

1. Recibe capital `P`, tasa anual y plazo `n`.
2. Calcula `r = tasaAnual / 12 / 100`.
3. Calcula la cuota constante `C = P · [r(1+r)^n] / [(1+r)^n − 1]`.
4. Para cada cuota `i` de 1 a `n`:
   a. Fecha de pago = fecha de creación + `i` meses (mismo día del mes).
   b. Interés del período = saldo pendiente × `r`; capital del período = `C` − interés; saldo pendiente −= capital.
   c. Crea la cuota con estado `pagada = false` y `atrasada = false`.
5. Devuelve la tabla completa.

**Nota de implementación:** el ajuste por redondeo se aplica en la última cuota para que la suma de capitales sea exactamente `P`. Si el día del mes no existe (31 → febrero), se usa el último día del mes.

## CU-12 · Editar tasa de interés
**Actor:** administrador · **Precondición:** préstamo activo

1. El sistema muestra la tasa actual precargada.
2. El administrador envía la nueva tasa (obligatoria).
3. El sistema identifica las cuotas con **fecha de pago posterior a hoy** y no pagadas.
4. Recalcula esas cuotas con la nueva tasa sobre el saldo pendiente restante. Las vencidas y las pagadas no se tocan.
5. Actualiza la tasa del préstamo.
6. Envía correo al cliente con la nueva tasa y el nuevo valor de cuota.

**Alternativos:** 2a. Tasa no válida → 400. 3a. No hay cuotas futuras → solo se actualiza la tasa.

## CU-13 · Asignar tarjeta de crédito
**Actor:** administrador

1. Selecciona un cliente activo y avanza.
2. Ingresa el **límite de crédito** y confirma.
3. El sistema genera un número de **16 dígitos** único.
4. Genera un **CVC de 3 dígitos** aleatorio y lo **hashea con SHA-256**.
5. Calcula la expiración = hoy + 3 años, almacenada como MM/AA.
6. Crea la tarjeta activa con deuda 0, asociada al cliente y al administrador responsable.

**Alternativos:** 3a. Colisión de número → se regenera.
**Postcondición:** tarjeta activa emitida.

## CU-14 · Editar límite de tarjeta
**Actor:** administrador

1. El sistema muestra el límite actual precargado.
2. El administrador envía el nuevo límite.
3. El sistema valida que `nuevoLímite >= deudaActual`.
4. Actualiza el límite y envía correo al cliente con el nuevo límite y los últimos 4 dígitos.

**Alternativos:** 3a. Límite menor a la deuda → 400 sin cambios.

## CU-15 · Cancelar tarjeta de crédito
**Actor:** administrador

1. El sistema muestra *"¿Está seguro que desea cancelar la tarjeta [XXXX]?"*.
2. Al aceptar, valida que la deuda sea exactamente cero.
3. Marca la tarjeta como **cancelada**.

**Alternativos:** 2a. Deuda > 0 → *"Para cancelar esta tarjeta, el cliente debe saldar la totalidad de la deuda pendiente."*
**Postcondición:** la tarjeta rechaza todo consumo o pago y desaparece de los productos del cliente.

## CU-16 · Agregar beneficiario
**Actor:** cliente

1. Envía el número de cuenta del beneficiario.
2. El sistema verifica que la cuenta exista.
3. Registra la relación cliente ↔ cuenta.

**Alternativos:** 2a. Cuenta inexistente → mensaje de número no válido. 3a. Ya registrado → no se duplica.

## CU-17 · Eliminar beneficiario
**Actor:** cliente

1. Solicita eliminar; el sistema pide confirmación.
2. Al confirmar, elimina la relación.

## CU-18 · Transferencia express
**Actor:** cliente

1. Envía cuenta destino, monto y cuenta de origen (de sus cuentas activas).
2. El sistema valida que la **cuenta destino exista y esté activa**.
3. Valida que la **cuenta de origen tenga fondos suficientes**.
4. Muestra pantalla de confirmación con **nombre y apellido del titular destino**.
5. Al confirmar, abre transacción de base de datos:
   a. Debita el monto de la cuenta origen.
   b. Acredita el monto en la cuenta destino.
   c. Registra **DÉBITO** en origen (beneficiario = cuenta destino) y **CRÉDITO** en destino (origen = cuenta de origen), ambos con estado **APROBADA**.
6. Confirma la transacción y envía dos correos (emisor y receptor).
7. Redirige al Home del cliente.

**Alternativos:**
- 2a. Cuenta inexistente o inactiva → operación cancelada con mensaje de cuenta no válida.
- 3a. Fondos insuficientes → operación cancelada; se registra la transacción con estado **RECHAZADO**.
- 5a. El cliente cancela → nada se ejecuta y vuelve al Home.

**Postcondición:** fondos transferidos y trazabilidad registrada en ambas cuentas.

## CU-19 · Transferencia a beneficiario
**Actor:** cliente

Idéntico a CU-18, salvo que la cuenta destino se elige de la lista de beneficiarios y la pantalla de confirmación muestra el titular del beneficiario.

## CU-20 · Transferencia entre cuentas propias
**Actor:** cliente

1. Envía cuenta de origen, cuenta de destino y monto.
2. El sistema valida que **ambas cuentas le pertenezcan**, estén activas y sean **distintas**.
3. Valida fondos suficientes.
4. En una transacción: debita origen, acredita destino y registra **DÉBITO** y **CRÉDITO**.

**Alternativos:** 2a. Misma cuenta → error de validación. 3a. Fondos insuficientes → mensaje y registro rechazado.

## CU-21 · Pago a tarjeta de crédito
**Actor:** cliente (o cajero, ver CU-27)

1. Envía tarjeta destino, cuenta de origen y monto.
2. El sistema valida que la tarjeta esté activa y pertenezca al cliente, y que la cuenta tenga fondos.
3. Calcula `montoAplicado = min(monto, deudaActual)` — **no se puede sobrepagar**.
4. En una transacción: reduce la deuda de la tarjeta en `montoAplicado` y debita ese mismo importe de la cuenta.
5. Registra la transacción en la cuenta de origen (beneficiario = últimos 4 dígitos / número de la tarjeta) y el pago para los indicadores.
6. Envía correo con asunto `Pago realizado a la tarjeta [XXXX]`.

**Alternativos:** 2a. Fondos insuficientes → mensaje y registro rechazado. 2b. Tarjeta cancelada → rechazo.
**Postcondición:** deuda reducida; el excedente nunca sale de la cuenta.

## CU-22 · Pago a préstamo
**Actor:** cliente (o cajero, ver CU-28)

1. Envía préstamo destino, cuenta de origen y monto.
2. El sistema valida que el préstamo esté activo y que la cuenta tenga fondos.
3. Abre una transacción y debita el monto de la cuenta.
4. Recupera las cuotas pendientes ordenadas por fecha de pago ascendente.
5. Mientras quede saldo del pago y existan cuotas pendientes:
   a. Aplica el saldo a la cuota actual, total o parcialmente (`montoPagado` acumulado en la cuota).
   b. Si la cuota queda cubierta, la marca **pagada** y **no atrasada**.
   c. Descuenta lo aplicado del saldo disponible y pasa a la siguiente cuota.
6. Si queda **excedente** tras cubrir todas las cuotas, lo devuelve a la cuenta de origen.
7. Si todas las cuotas quedan pagadas, marca el préstamo como **completado**.
8. Registra la transacción (beneficiario = número del préstamo) y confirma.
9. Envía correo con asunto `Pago realizado al préstamo [XXXXXXXXX]`.

**Alternativos:** 2a. Fondos insuficientes o préstamo completado/inexistente → operación cancelada.
**Postcondición:** cuotas actualizadas; ningún dinero perdido.

## CU-23 · Avance de efectivo
**Actor:** cliente

1. Envía tarjeta de origen, cuenta de ahorro destino y monto del avance.
2. El sistema calcula `disponible = límite − deudaActual`.
3. Valida `monto <= disponible`; si no, rechaza el avance.
4. Calcula `interés = monto × 0.0625`.
5. En una transacción:
   a. Suma `monto` al balance de la cuenta destino.
   b. Suma `monto + interés` a la deuda de la tarjeta.
   c. Registra un **consumo** en la tarjeta con comercio = **"AVANCE"** y estado APROBADO.
   d. Registra la transacción en la cuenta destino con origen = últimos 4 dígitos de la tarjeta.
6. Envía correo con asunto `Avance de efectivo desde la tarjeta [XXXX]`.

**Alternativos:** 3a. Excede el disponible → consumo registrado como **RECHAZADO** y mensaje al cliente.
**Ejemplo:** límite RD$500, deuda RD$300 → disponible RD$200; un avance de RD$201 se rechaza. Un avance de RD$100 deja la deuda en RD$406.25.

## CU-24 · Consultar productos del cliente
**Actor:** cliente

1. El sistema obtiene las cuentas activas del cliente autenticado, ordenadas con la principal primero y las secundarias descendente por balance.
2. Obtiene los préstamos activos y las tarjetas activas.
3. Devuelve solo las secciones con datos.

**Postcondición:** el cliente nunca recibe productos de otro cliente.

## CU-25 · Depósito por cajero
**Actor:** cajero

1. Envía número de cuenta destino y monto.
2. El sistema valida que la cuenta exista y esté activa.
3. Muestra confirmación con nombre y apellido del titular.
4. Al confirmar, acredita el monto y registra **CRÉDITO** con **Origen = "DEPÓSITO"** y **Beneficiario = número de cuenta destino**, asociando al cajero.
5. Envía correo `Depósito realizado a su cuenta [XXXX]`.

**Alternativos:** 2a. Cuenta inválida o inactiva → mensaje. 3a. Cancelación → sin cambios.

## CU-26 · Retiro por cajero
**Actor:** cajero

1. Envía número de cuenta origen y monto.
2. Valida existencia, estado activo y fondos suficientes.
3. Confirmación con el titular de la cuenta.
4. Debita el monto y registra **DÉBITO** con **Origen = número de cuenta** y **Beneficiario = "RETIRO"**.
5. Envía correo `Retiro realizado a su cuenta [XXXX]`.

## CU-27 · Pago a tarjeta por cajero
**Actor:** cajero

1. Envía número de cuenta origen, monto y número de tarjeta (16 dígitos).
2. Valida: cuenta existe y activa → tarjeta existe y activa → fondos suficientes.
3. Confirmación con nombre y apellido del titular de la tarjeta.
4. Aplica la regla de no sobrepago y ejecuta como CU-21, registrando **Beneficiario = los 16 dígitos de la tarjeta** y asociando al cajero.

## CU-28 · Pago a préstamo por cajero
**Actor:** cajero

1. Envía número de cuenta origen, monto y número de préstamo (9 dígitos).
2. Valida: cuenta existe y activa → préstamo existe y no completado → fondos suficientes.
3. Confirmación con el titular del préstamo.
4. Ejecuta el algoritmo de CU-22, registrando **Beneficiario = los 9 dígitos del préstamo**.

## CU-29 · Transacción a terceros por cajero
**Actor:** cajero

1. Envía cuenta origen, monto y cuenta destino.
2. Valida: origen existe y activa → fondos suficientes → destino existe y activa.
3. Confirmación con el titular de la **cuenta destino**.
4. En una transacción: debita origen, acredita destino y registra **DÉBITO** en origen y **CRÉDITO** en destino, ambos con origen = cuenta origen y beneficiario = cuenta destino.
5. Envía los dos correos (emisor y receptor).

## CU-30 · Administrar comercios
**Actor:** administrador

1. Crea, consulta, edita o cambia el estado de un comercio.
2. Al **desactivar**, el sistema desactiva en cascada **todos los usuarios asociados**.
3. Al **reactivar**, el comercio queda activo pero **sus usuarios permanecen inactivos** y deben pasar por el flujo de reseteo de contraseña (CU-03) para volver a operar.

## CU-31 · Crear usuario de comercio
**Actor:** administrador

1. Envía los datos del usuario y el `commerceId`.
2. El sistema valida unicidad de usuario y correo.
3. Valida que el comercio **no tenga ya un usuario asociado**.
4. Crea el usuario inactivo con rol **comercio** y una cuenta de ahorro **principal** con número único de 9 dígitos y balance inicial.
5. Envía el correo de activación con el **token en el cuerpo**.

**Alternativos:** 3a. El comercio ya tiene usuario → 400.

## CU-32 · Procesar pago con tarjeta (Hermes Pay)
**Actor:** comercio (o administrador en su nombre)

1. El actor envía `cardNumber`, `monthExpirationCard`, `yearExpirationCard`, `CVC` y `transactionAmount`.
2. El sistema determina el comercio: del **JWT** si el rol es comercio; del parámetro de URL si es administrador.
3. Valida que todos los campos estén presentes.
4. Valida que el comercio exista.
5. Valida la tarjeta: número de 16 dígitos existente, **activa**, expiración coincidente y **no vencida**, y CVC correcto (comparación contra el hash SHA-256).
6. Valida el crédito: `deudaActual + monto <= límite`.
7. En una transacción:
   a. Suma el monto a la deuda de la tarjeta.
   b. Registra el **consumo** con monto, fecha y hora, nombre del comercio y estado **APROBADO**.
   c. Acredita el monto en la **cuenta de ahorro principal del usuario del comercio** y registra la transacción de crédito.
8. Envía dos correos: `Consumo realizado con la tarjeta [XXXX]` al cliente y `Pago recibido a través de tarjeta [XXXX]` al comercio.

**Alternativos:**
- 5a. Datos de tarjeta inválidos o tarjeta cancelada/vencida → 400 y consumo registrado como **RECHAZADO**.
- 6a. Crédito insuficiente → 400 y consumo registrado como **RECHAZADO**.

**Postcondición:** comercio acreditado, deuda de la tarjeta aumentada, ambas partes notificadas.

## CU-33 · Marcar cuotas atrasadas (job diario)
**Actor:** sistema

1. El scheduler dispara el job una vez al día.
2. El sistema selecciona todas las cuotas con `pagada = false` y `fechaPago < hoy`.
3. Marca cada una como `atrasada = true`.
4. Registra el resultado (cuotas evaluadas y actualizadas).

**Alternativos:** el job es **idempotente**: ejecutarlo dos veces el mismo día no produce efectos adicionales. Al pagarse una cuota, se marca `atrasada = false` y `pagada = true`.

## CU-34 · Calcular indicadores del dashboard
**Actor:** administrador / cajero

1. El sistema agrega los contadores descritos en la sección 8.2.1 (administrador) u 8.4.1 (cajero).
2. Los resultados costosos (deuda promedio, totales históricos) se cachean en **Redis** con TTL corto y se invalidan al registrarse nuevas transacciones relevantes.

---

# 8. Requisitos funcionales detallados

## 8.1 Autenticación y seguridad

- **Login**: formulario con usuario y contraseña, ambos requeridos. Usuario autenticado que intente abrir el login → redirección automática a su Home. Credenciales incorrectas → mensaje de datos de acceso incorrectos. Cuenta inactiva → rechazo con mensaje indicando que debe activarla mediante el enlace enviado a su correo.
- **Logout**: elimina la sesión (invalida el refresh token en Redis) y redirige al login.
- **Activación**: todo usuario se crea inactivo y recibe un correo con enlace + token (web) o token en el cuerpo (API).
- **Reseteo de contraseña**: inactiva al usuario, genera y envía el token, y reactiva al completarse. Validaciones: campos requeridos y coincidencia de contraseñas.
- **Seeding**: roles `administrador`, `cajero`, `cliente`, `comercio` y un usuario por cada rol.
- **Tokens**: access token de vida corta (15 min) y refresh token en Redis con revocación.
- **Rate limiting** en login, reseteo de contraseña y Hermes Pay.

## 8.2 Administrador

### 8.2.1 Dashboard

| Indicador | Cálculo |
|---|---|
| Transacciones totales | Todas las registradas desde el inicio |
| Transacciones del día | Fecha = hoy |
| Pagos del día | Pagos (TC + préstamo) con fecha = hoy |
| Pagos totales | Todos los pagos históricos |
| Clientes activos / inactivos | Usuarios rol cliente por estado |
| Productos asignados | Cuentas + préstamos + tarjetas de clientes |
| Préstamos vigentes | Préstamos activos |
| Tarjetas emitidas | Tarjetas activas |
| Cuentas de ahorro abiertas | Total de cuentas de clientes |
| **Deuda promedio por cliente** | Deuda total de clientes activos ÷ clientes activos |

### 8.2.2 Gestión de usuarios

Listado sin usuarios de rol comercio, del más reciente al más antiguo, paginado de 20 en 20, con navegación. Columnas: usuario, cédula, nombre, apellido, correo, tipo, estado. Filtro `select` por rol. Botón **Crear usuario**. Acciones: activar/inactivar (con confirmación) y editar.

- **Crear**: Nombre, Apellido, Cédula, Correo, Usuario, Contraseña, Confirmar contraseña, Tipo de usuario; si el tipo es cliente aparece **Monto inicial** (único campo opcional, puede ser 0). Unicidad de usuario y correo validada antes de enviar. Cliente → cuenta principal automática con número único de 9 dígitos. Usuario creado inactivo + correo de activación.
- **Editar**: administradores y cajeros → nombre, apellido, cédula, correo, usuario y contraseña (con confirmación); el tipo no se modifica. Clientes → los mismos campos + **Monto adicional**, que se suma al balance de la cuenta principal (ej.: RD$5,000 + RD$12,000 = RD$17,000).
- **Restricción**: el administrador autenticado no puede editar ni cambiar el estado de su propia cuenta.

### 8.2.3 Gestión de préstamos

Listado de préstamos activos, del más reciente al más antiguo, paginado de 20 en 20. Columnas: número, cliente, capital, cuotas totales, cuotas pagadas, pendiente, tasa, plazo en meses, al día / en mora. Botones: **Ver detalles** y **Editar**. Buscador por cédula (activos primero, luego completados) y `select` de estado. Botón **Asignar préstamo**.

- **Paso 1**: clientes activos **sin préstamo activo**, con la deuda promedio del sistema y buscador por cédula; columnas cédula, nombre y apellido, correo y deuda total; selección por `radio`; botones **Siguiente paso** y volver.
- **Paso 2**: plazo (`select` con 6, 12, 18, 24, 30, 36, 42, 48, 54, 60), monto y tasa anual; botones volver y confirmar.
- **Advertencia de riesgo**: mensajes exactos definidos en CU-10, con confirmación final.
- **Persistencia**: cliente, monto aprobado, duración, tasa anual, administrador responsable, estado activo, número único de 9 dígitos.

**Fórmula del sistema francés:**

```
C = P · [ r(1 + r)^n ] / [ (1 + r)^n − 1 ]

C = cuota mensual constante
P = capital del préstamo
r = tasa periódica mensual = tasa anual / 12
n = número total de pagos (plazo en meses)
```

Ejemplo: P = RD$100,000 · 12% anual → r = 0.01 · n = 12 → **C ≈ RD$8,885.29**

**Vencimientos**: la primera cuota vence el mismo día del mes siguiente a la creación del préstamo (préstamo del 5 de julio de 2025 → cuota 1 el 5 de agosto, cuota 2 el 5 de septiembre, y así hasta el plazo).

**Cada cuota almacena**: fecha de pago, préstamo, valor de la cuota, estado de pago, indicador de atraso.

**Tras crear el préstamo**: el capital se suma al balance de la cuenta principal (RD$5,000 + RD$100,000 = RD$105,000), se registra la transacción de crédito, se envía correo con monto, plazo, tasa y cuota mensual, y se redirige al listado.

**Ver detalles**: tabla de amortización con fecha, valor, estado de pago e indicador de atraso + botón volver.
**Editar**: un solo campo (tasa anual, obligatorio, precargado); recalcula solo cuotas futuras; correo con la nueva tasa y la nueva cuota.

### 8.2.4 Gestión de tarjetas de crédito

Listado de tarjetas activas, de la más reciente a la más antigua, paginado de 20 en 20. Columnas: número, cliente, límite, expiración MM/AA (ej. 03/26), monto adeudado. Botones: **Ver detalles**, **Editar**, **Cancelar**. Buscador por cédula (activas primero, luego canceladas) y `select` de estado. Botón **Asignar tarjeta de crédito** con el mismo flujo de dos pasos (selección de cliente activo → formulario con un único campo: límite).

**Datos persistidos**: cliente, límite, expiración = hoy + 3 años en MM/AA, número único de 16 dígitos, **CVC de 3 dígitos cifrado con SHA-256**, administrador responsable, estado activa, deuda 0.

**Ver detalles**: consumos del más reciente al más antiguo con fecha, monto, comercio (o **"AVANCE"**) y estado **APROBADO** / **RECHAZADO**.
**Editar**: límite obligatorio y precargado; no puede ser inferior a la deuda; correo al cliente con el nuevo límite y los últimos 4 dígitos.
**Cancelar**: confirmación *"¿Está seguro que desea cancelar la tarjeta [XXXX]?"*; con deuda > 0 → *"Para cancelar esta tarjeta, el cliente debe saldar la totalidad de la deuda pendiente."*; sin deuda → estado cancelada, rechazo de todo consumo y desaparición de los productos del cliente.

### 8.2.5 Gestión de cuentas de ahorro

Listado de cuentas activas (principales y secundarias), de la más reciente a la más antigua, paginado de 20 en 20. Columnas: número, cliente, balance, tipo. Botones: **Ver detalles** y **Cancelar** (solo secundarias). Buscador por cédula (activas primero, luego canceladas) y filtros por estado y por tipo. Botón **Asignar cuenta de ahorro** (dos pasos; formulario con un único campo: balance inicial, puede ser 0).

**Datos persistidos**: cliente, balance inicial, fecha de creación, número único de 9 dígitos, administrador responsable, estado activo, tipo secundaria.

**Historial de transacciones** (compartido con el cliente):

| Campo | Contenido |
|---|---|
| Fecha | Fecha y hora |
| Monto | Valor movido |
| Tipo | **DÉBITO** (salida) o **CRÉDITO** (entrada) |
| Beneficiario | Transferencia (express o beneficiario) → cuenta destino · Retiro por cajero → "RETIRO" · Pago a TC → últimos 4 dígitos · Pago a préstamo → número del préstamo · Depósito por cajero → cuenta destino |
| Origen | Transferencia → cuenta de donde salieron los fondos · Retiro por cajero → cuenta de origen · Avance → últimos 4 dígitos de la tarjeta · Desembolso de préstamo → número del préstamo · Depósito por cajero → "DEPÓSITO" |
| Estado | **APROBADA** o **RECHAZADO** |

**Cancelación**: confirmación *"¿Está seguro que desea cancelar la cuenta [XXXXXXXXX]?"*; si tiene balance, se transfiere a la principal y la cuenta queda en cero; luego pasa a cancelada y deja de aparecer en los productos del cliente.

## 8.3 Cliente

**Navegación:**

```
Home
Transacciones
   ├── Express
   ├── Tarjeta de crédito
   ├── Préstamo
   └── Beneficiarios
Beneficiario
Avance de efectivo
Transferencia
Cerrar sesión
```

**Home**: hasta tres secciones con los productos activos.
1. **Cuentas de ahorro** — número, balance, tipo; principal primero, secundarias descendente por balance; botón Ver detalles → historial.
2. **Préstamos activos** (sección oculta si no tiene) — número, capital, cuotas totales, cuotas pagadas, pendiente, tasa, plazo, al día / en mora; Ver detalles → tabla de amortización.
3. **Tarjetas activas** (sección oculta si no tiene) — número, límite, expiración MM/AA, monto adeudado; Ver detalles → consumos.

**Beneficiarios**: listado con nombre, apellido y número de cuenta; botón **Agregar beneficiario** (modal con un único campo obligatorio: número de cuenta; si no existe, mensaje de número no válido); botón de eliminar con confirmación.

**Transacción express** · **a tarjeta de crédito** · **a préstamo** · **a beneficiario** · **avance de efectivo** · **transferencia entre cuentas propias**: formularios, validaciones, efectos y correos según CU-18 a CU-23. Todos los campos son obligatorios en todos los formularios.

## 8.4 Cajero

### 8.4.1 Home

Menú: Home · Depósito · Retiro · Pago a tarjeta de crédito · Pago a préstamo · Transacciones a cuentas de terceros · Cerrar sesión.

Indicadores, **todos del cajero autenticado y del día actual**: total de transacciones, total de pagos (TC + préstamos), total de depósitos, total de retiros.

### 8.4.2 Operaciones

Depósito, retiro, pago a tarjeta, pago a préstamo y transacciones a terceros según CU-25 a CU-29. Todos los formularios exigen confirmación con el nombre y apellido del titular correspondiente, y la cancelación siempre devuelve al Home del cajero sin ejecutar nada.

**Registro cruzado en transacciones a terceros:**

| Cuenta | Tipo | Origen | Beneficiario |
|---|---|---|---|
| Origen | DÉBITO | cuenta origen | cuenta destino |
| Destino | CRÉDITO | cuenta origen | cuenta destino |

---

# 9. API REST

## 9.1 Convenciones

- Base: `/api` (plataforma) y `/pay` (partners).
- Autenticación: `Authorization: Bearer {token_jwt}`.
- Montos en los DTOs como **string decimal** (`"689.25"`), nunca como `number`.
- Errores con forma uniforme:

```json
{ "error": { "code": "INSUFFICIENT_FUNDS", "message": "El monto excede el saldo disponible", "details": [] } }
```

- Códigos: **200** OK · **201** creado · **204** sin contenido · **400** validación · **401** sin token o token inválido · **403** rol sin permiso · **404** no encontrado · **409** conflicto (duplicado o alto riesgo) · **422** regla de negocio · **429** rate limit.
- Documentación en `/docs` (Swagger UI) generada desde OpenAPI 3.

## 9.2 Autenticación

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/account/login` | Público | Obtener JWT |
| POST | `/account/refresh` | Público (refresh token) | Renovar access token |
| POST | `/account/logout` | Autenticado | Revocar refresh token |
| POST | `/account/confirm` | Autenticado | Confirmar cuenta con token |
| POST | `/account/get-reset-token` | Autenticado | Generar token de reseteo (token en el cuerpo del correo) |
| POST | `/account/reset-password` | Autenticado | Cambiar contraseña |

```
POST /account/login
{ "userName": "admin", "password": "123P@$$word!" }
→ 200 { "jwt": "eyJhbGciOiJIUzI1NiIs...", "refreshToken": "...", "role": "administrador" }
→ 400 faltan parámetros · 401 credenciales incorrectas
```

```
POST /account/confirm        { "token": "..." }                       → 204 · 400 · 401
POST /account/get-reset-token { "userName": "admin" }                 → 204 · 400 · 401
POST /account/reset-password  { "userId": "1", "token": "...",
                                "password": "...", "confirmPassword": "..." } → 204 · 400 · 401
```

## 9.3 Usuarios (rol Administrador)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users` | Listado paginado sin usuarios de comercio. Query: `page` (1), `pageSize` (20), `rol` |
| GET | `/api/users/commerce` | Listado paginado de usuarios con rol comercio |
| POST | `/api/users` | Crear usuario |
| POST | `/api/users/commerce/{commerceId}` | Crear usuario de comercio |
| PUT | `/api/users/{id}` | Actualizar usuario |
| PATCH | `/api/users/{id}/status` | Activar / inactivar |
| GET | `/api/users/{id}` | Detalle de usuario |

```json
// GET /api/users → 200
{
  "data": [
    { "usuario": "jdoe", "cedula": "00112345678", "nombre": "Juan",
      "apellido": "Doe", "correo": "jdoe@email.com", "rol": "cliente", "estado": "activo" }
  ],
  "paginacion": { "paginaActual": 1, "totalPaginas": 5, "totalUsuarios": 100 }
}
```

```json
// POST /api/users
{
  "nombre": "Juan", "apellido": "Perez", "cedula": "00123456789",
  "correo": "juanperez@email.com", "usuario": "juanp",
  "contrasena": "Password123!", "confirmarContrasena": "Password123!",
  "tipoUsuario": "cliente", "montoInicial": "5000.00"
}
// 201 · 400 · 409 usuario o correo ya registrado · 401 · 403
```

```json
// PUT /api/users/{id}
{ "nombre": "Juan", "apellido": "Perez", "cedula": "00123456789",
  "correo": "nuevo@email.com", "usuario": "juanp",
  "contrasena": "NuevaPass123!", "confirmarContrasena": "NuevaPass123!",
  "montoAdicional": "10000.00" }
// 204 · 400 · 404 · 409

// PATCH /api/users/{id}/status
{ "status": true }
// 204 · 400 · 403 auto-modificación o rol incorrecto · 404
```

```json
// GET /api/users/{id} → 200
{ "usuario": "juanp", "nombre": "Juan", "apellido": "Perez",
  "cedula": "00123456789", "correo": "juan@email.com",
  "rol": "cliente", "estado": "activo",
  "cuentaPrincipal": { "numeroCuenta": "123456789", "balance": "17000.00" } }
```

## 9.4 Préstamos (rol Administrador)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/loan` | Query: `pagina`, `estado` (activos\|completados), `cedula` |
| POST | `/api/loan` | Asignar préstamo |
| GET | `/api/loan/{id}` | Detalle + tabla de amortización |
| PATCH | `/api/loan/{id}/rate` | Editar tasa |

```json
// GET /api/loan → 200
{
  "data": [
    { "id": "000012345", "cliente": "Juan Pérez", "cedula": "00112345678",
      "monto": "100000.00", "cuotasTotales": 12, "cuotasPagadas": 4,
      "pendiente": "68000.00", "interes": 12, "plazo": 12, "estadoPago": "al_dia" }
  ],
  "paginacion": { "paginaActual": 1, "totalPaginas": 4 }
}

// POST /api/loan
{ "clienteId": "123", "monto": "150000.00", "interesAnual": 14.5, "plazoMeses": 24 }
// 201 · 400 cliente con préstamo activo · 409 cliente de alto riesgo · 401 · 403

// GET /api/loan/{id} → 200
{ "prestamoId": "000012345",
  "tablaAmortizacion": [
    { "cuota": 1, "fechaPago": "2025-08-05", "valor": "8950.50", "pagada": false, "atrasada": false }
  ] }

// PATCH /api/loan/{id}/rate
{ "nuevaTasa": 11.75 }        // 204 · 400 · 404 · 401 · 403
```

> El **409** de alto riesgo puede reintentarse con `{"confirmarAltoRiesgo": true}` para completar la asignación.

## 9.5 Tarjetas de crédito (rol Administrador)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/credit-card` | Query: `cedula`, `estado` (activa\|cancelada), `pagina` |
| POST | `/api/credit-card` | Asignar tarjeta |
| GET | `/api/credit-card/{id}` | Consumos de la tarjeta |
| PATCH | `/api/credit-card/{id}/limit` | Editar límite |
| PATCH | `/api/credit-card/{id}/cancel` | Cancelar tarjeta |

```json
// GET /api/credit-card → 200
{ "data": [ { "numero": "1234567890123456", "cliente": "Juan Pérez",
              "limite": "50000.00", "fechaExpiracion": "03/26",
              "montoAdeudado": "12450.00", "estado": "activa" } ],
  "paginacion": { "paginaActual": 1, "totalPaginas": 5, "totalRegistros": 100 } }

// POST /api/credit-card   { "clienteId": 1, "limite": "30000.00" }   → 201 · 400 · 409
// GET /api/credit-card/{id} → 200
{ "consumos": [
    { "fecha": "2025-07-01", "monto": "1200.00", "comercio": "Supermercado Bravo", "estado": "APROBADO" },
    { "fecha": "2025-07-02", "monto": "500.00",  "comercio": "AVANCE", "estado": "RECHAZADO" } ] }

// PATCH /api/credit-card/{id}/limit  { "nuevoLimite": "35000.00" }
// 204 · 400 nuevo límite menor a la deuda · 404
// PATCH /api/credit-card/{id}/cancel
// 204 · 400 el cliente aún tiene deuda · 404
```

## 9.6 Cuentas de ahorro (rol Administrador)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/savings-account` | Query: `cedula`, `estado` (activo\|cancelado), `tipo` (principal\|secundaria), `pagina` |
| POST | `/api/savings-account` | Crear cuenta secundaria |
| GET | `/api/savings-account/{accountNumber}/transactions` | Transacciones de la cuenta |

```json
// GET /api/savings-account → 200
{ "data": [ { "numeroCuenta": "123456789", "nombreCliente": "Juan", "apellidoCliente": "Pérez",
              "balance": "15000.50", "tipoCuenta": "principal", "estado": "activo" } ],
  "paginacion": { "paginaActual": 1, "totalPaginas": 5, "totalRegistros": 100 } }

// POST /api/savings-account  { "cedulaCliente": "00112345678", "balanceInicial": "500.00" }
// 201 · 400 · 409 · 401 · 403

// GET /api/savings-account/{accountNumber}/transactions → 200
{ "transacciones": [
    { "fecha": "2025-07-01T10:00:00", "monto": "200.00", "tipo": "DÉBITO",
      "beneficiario": "123456789", "origen": "456789123", "estado": "APROBADA" } ] }
```

## 9.7 Comercios (rol Administrador)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/commerce?page=1&pageSize=20` | Listado paginado del más reciente al más antiguo. **Sin parámetros de paginación devuelve todos los comercios activos** |
| GET | `/api/commerce/{id}` | Detalle |
| POST | `/api/commerce` | Crear comercio |
| PUT | `/api/commerce/{id}` | Actualizar comercio |
| PATCH | `/api/commerce/{id}` | Activar / desactivar |

```json
// GET /api/commerce → 200
{ "data": [ { "id": 1, "name": "Farmacia Los Próceres",
              "descripcion": "Comercio del sector salud",
              "logo": "https://cdn.misitio.com/farmacia_logo.png" } ],
  "paginacion": { "paginaActual": 1, "totalPaginas": 5, "totalComercios": 100 } }

// POST /api/commerce
{ "name": "Supermercado Central", "descripcion": "Cadena nacional de supermercados",
  "logo": "https://cdn.misitio.com/supermercado_logo.png" }     // 201 · 400 · 401 · 403

// PATCH /api/commerce/{id}   { "status": true }                // 204 · 401 · 403 · 404
```

**Regla crítica**: al desactivar un comercio se desactivan todos sus usuarios; al reactivarlo, los usuarios permanecen inactivos y deben resetear su contraseña para volver a activarse.

## 9.8 Hermes Pay (roles Administrador y Comercio)

En ambos endpoints: si el rol es **comercio**, el identificador se toma del **JWT** e **ignora** cualquier `commerceId` en la URL; si el rol es **administrador**, el `commerceId` debe venir en la URL.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/pay/get-transactions/{commerceId}` | Transacciones recibidas en la cuenta principal del comercio. Query: `page` (1), `pageSize` (20) |
| POST | `/pay/process-payment/{commerceId}` | Procesar un cobro con tarjeta |

```json
// GET /pay/get-transactions/{commerceId} → 200
{ "transacciones": [
    { "fecha": "2025-07-01T10:00:00", "monto": "200.00", "tipo": "DÉBITO",
      "beneficiario": "123456789", "origen": "456789123", "estado": "APROBADA" } ] }

// POST /pay/process-payment/{commerceId}
{ "cardNumber": "1589963258467598", "monthExpirationCard": "02",
  "yearExpirationCard": "2028", "CVC": "859", "transactionAmount": "689.25" }
// 204 · 400 datos de tarjeta o comercio incorrectos · 401
```

Validaciones completas y efectos en CU-32.

## 9.9 Endpoints de plataforma (cliente y cajero)

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/api/me/products` | Cliente | Cuentas, préstamos y tarjetas activos |
| GET | `/api/me/accounts/{number}/transactions` | Cliente | Historial de una cuenta propia |
| GET | `/api/me/loans/{id}` | Cliente | Tabla de amortización propia |
| GET | `/api/me/cards/{id}/consumptions` | Cliente | Consumos de una tarjeta propia |
| GET | `/api/beneficiaries` | Cliente | Listar beneficiarios |
| POST | `/api/beneficiaries` | Cliente | Agregar por número de cuenta |
| DELETE | `/api/beneficiaries/{id}` | Cliente | Eliminar |
| POST | `/api/transactions/express/validate` | Cliente | Validar y obtener el titular destino |
| POST | `/api/transactions/express` | Cliente | Ejecutar transferencia express |
| POST | `/api/transactions/beneficiary` | Cliente | Transferencia a beneficiario |
| POST | `/api/transactions/internal` | Cliente | Transferencia entre cuentas propias |
| POST | `/api/transactions/card-payment` | Cliente | Pago a tarjeta |
| POST | `/api/transactions/loan-payment` | Cliente | Pago a préstamo |
| POST | `/api/transactions/cash-advance` | Cliente | Avance de efectivo |
| POST | `/api/teller/deposit` | Cajero | Depósito |
| POST | `/api/teller/withdrawal` | Cajero | Retiro |
| POST | `/api/teller/card-payment` | Cajero | Pago a tarjeta |
| POST | `/api/teller/loan-payment` | Cajero | Pago a préstamo |
| POST | `/api/teller/third-party` | Cajero | Transacción a terceros |
| GET | `/api/dashboard/admin` | Administrador | Indicadores globales |
| GET | `/api/dashboard/teller` | Cajero | Indicadores del día |

> Los endpoints `/validate` devuelven el nombre y apellido del titular para las pantallas de confirmación, sin ejecutar ningún movimiento.

---

# 10. Reglas de negocio

**Identificadores**

1. Cuentas de ahorro y préstamos usan números de **9 dígitos** que comparten espacio de unicidad: un número usado por una cuenta no puede usarse por un préstamo y viceversa.
2. Las tarjetas usan números de **16 dígitos** únicos.
3. El CVC se genera automáticamente (3 dígitos) y se almacena **hasheado con SHA-256**.

**Cuentas de ahorro**

4. Todo cliente tiene exactamente **una cuenta principal**, creada junto con el usuario y no cancelable.
5. Las cuentas secundarias son cancelables; al cancelarlas, su balance pasa a la cuenta principal.
6. Una cuenta cancelada o inactiva no recibe ni emite transacciones.

**Préstamos**

7. Un cliente solo puede tener **un préstamo activo a la vez**.
8. Plazos válidos: múltiplos de 6 entre 6 y 60 meses.
9. La cuota se calcula con el **sistema francés** (cuota constante).
10. Al editar la tasa solo se recalculan las cuotas con fecha posterior a hoy.
11. El desembolso acredita la cuenta principal y genera una transacción de crédito.
12. Un préstamo con todas sus cuotas pagadas pasa a **completado**.
13. Un cliente está **en mora** si tiene al menos una cuota atrasada.

**Riesgo**

14. Deuda promedio del sistema = deuda total de clientes activos ÷ clientes activos.
15. Un cliente es de alto riesgo si su deuda actual supera el promedio, o si lo superaría al sumar capital + intereses del nuevo préstamo; en ambos casos se exige confirmación explícita (API: **409**).

**Tarjetas de crédito**

16. Crédito disponible = **límite − deuda actual**; ninguna operación puede excederlo.
17. El nuevo límite no puede ser inferior a la deuda actual.
18. Una tarjeta solo se cancela con deuda en **cero**.
19. Una tarjeta cancelada o vencida rechaza cualquier consumo o pago.
20. Los avances generan un interés del **6.25%** sobre el monto avanzado, sumado a la deuda.

**Pagos**

21. **No se puede sobrepagar una tarjeta**: si el monto excede la deuda, solo se debita la deuda.
22. En pagos a préstamo, el monto se aplica secuencialmente a las cuotas pendientes y el excedente final vuelve a la cuenta de origen.

**Transacciones**

23. Toda operación que mueve dinero valida fondos suficientes antes de ejecutarse.
24. Toda operación genera al menos un registro con tipo, origen, beneficiario y estado.
25. Una transferencia registra **DÉBITO** en origen y **CRÉDITO** en destino.
26. Las operaciones rechazadas también se registran, con estado **RECHAZADO**, para trazabilidad.
27. Los montos se manejan con precisión de centavos; nunca con punto flotante.
28. Cada operación que afecta balances se ejecuta dentro de una **transacción de base de datos**: se aplica completa o no se aplica.
29. El envío de correo **nunca** revierte una operación ya confirmada: se encola y se reintenta.

**Usuarios y seguridad**

30. Todo usuario se crea inactivo y requiere activación por correo.
31. El administrador autenticado no puede editarse ni cambiar su propio estado.
32. El reseteo de contraseña inactiva al usuario hasta completarse.
33. Al desactivar un comercio se desactivan sus usuarios; al reactivarlo siguen inactivos y deben resetear contraseña.
34. Usuario y correo son únicos en todo el sistema.
35. Un comercio solo puede tener **un usuario asociado** a la vez.

---

# 11. Requisitos no funcionales

| Área | Requisito |
|---|---|
| Arquitectura | Clean Architecture con dependencias dirigidas al dominio; el dominio no se acopla a ninguna infraestructura concreta |
| Persistencia | Patrón repositorio + Unit of Work; cambiar la implementación de persistencia no debe modificar los casos de uso |
| Precisión monetaria | `decimal.js` (o centavos enteros) en el dominio, `DECIMAL(18,2)` en MySQL, strings en los DTOs |
| Integridad | Transacciones de base de datos en toda operación que mueva balances; `SELECT ... FOR UPDATE` en los balances involucrados |
| Concurrencia | Bloqueo pesimista en balances de cuentas y deuda de tarjetas; claves de idempotencia en operaciones de dinero |
| Seguridad | Contraseñas con `argon2`/`bcrypt`; CVC con SHA-256; JWT con expiración corta y refresh revocable; rate limiting en Redis; secretos por variables de entorno |
| Privacidad | Mínimo privilegio y separación estricta de datos por usuario; nunca exponer CVC ni hashes |
| Validación | Zod en todos los bordes (body, params, query); el dominio revalida sus propias invariantes |
| Rendimiento | Paginación obligatoria en listados; índices en número de cuenta, tarjeta, préstamo y cédula; caching selectivo en Redis para indicadores |
| Jobs | BullMQ con reintentos, backoff y **idempotencia**; cola muerta para fallos persistentes |
| Observabilidad | Logs estructurados (Pino) con request ID, métricas básicas, health checks (`/health`, `/ready`) y auditoría de operaciones sensibles |
| Disponibilidad | Manejo centralizado de errores, recuperación de jobs fallidos, apagado ordenado |
| Mantenibilidad | TypeScript estricto, ESLint + Prettier, convenciones de commits, sin lógica de negocio en controladores |
| Testing | Unit para dominio, integración para infraestructura, E2E para flujos críticos |
| Documentación | OpenAPI/Swagger, README técnico, decisiones de arquitectura (ADR) y guía de despliegue |
| Despliegue | Docker Compose para desarrollo, variables de entorno validadas al arranque, CI/CD y ambientes separados |

---

# 12. Modelo de dominio

## 12.1 Entidades

| Entidad | Responsabilidad |
|---|---|
| `User` | Identidad: usuario, correo, cédula, nombre, apellido, estado, rol |
| `RefreshToken` | Sesión renovable, revocable (almacenada en Redis y/o MySQL) |
| `ActivationToken` / `ResetToken` | Token de un solo uso con expiración |
| `Commerce` | Comercio afiliado: nombre, descripción, logo, estado |
| `SavingsAccount` | Cuenta: número (9), balance, tipo, estado, cliente, creador |
| `CreditCard` | Tarjeta: número (16), límite, deuda, expiración MM/AA, CVC hash, estado, cliente, creador |
| `Loan` | Préstamo: número (9), capital, tasa anual, plazo, estado, cliente, creador |
| `AmortizationInstallment` | Cuota: préstamo, número, fecha de pago, valor, capital, interés, monto pagado, pagada, atrasada |
| `Transaction` | Movimiento sobre una cuenta: tipo, monto, origen, beneficiario, estado, fecha, operación, ejecutor |
| `CardConsumption` | Consumo: tarjeta, comercio (o "AVANCE"), monto, estado, fecha |
| `Beneficiary` | Relación cliente ↔ cuenta frecuente |
| `Payment` | Registro de pago (TC o préstamo) para los indicadores de dashboard |

## 12.2 Enums

```ts
export enum Role            { ADMIN = 'administrador', TELLER = 'cajero',
                              CLIENT = 'cliente', COMMERCE = 'comercio' }
export enum AccountType     { PRIMARY = 'principal', SECONDARY = 'secundaria' }
export enum ProductStatus   { ACTIVE = 'activa', CANCELLED = 'cancelada' }
export enum LoanStatus      { ACTIVE = 'activo', COMPLETED = 'completado' }
export enum TransactionType { DEBIT = 'DÉBITO', CREDIT = 'CRÉDITO' }
export enum TxStatus        { APPROVED = 'APROBADA', REJECTED = 'RECHAZADO' }
export enum ConsumptionStatus { APPROVED = 'APROBADO', REJECTED = 'RECHAZADO' }
export enum OperationType   { EXPRESS, BENEFICIARY, INTERNAL_TRANSFER, CARD_PAYMENT,
                              LOAN_PAYMENT, CASH_ADVANCE, LOAN_DISBURSEMENT,
                              TELLER_DEPOSIT, TELLER_WITHDRAWAL, TELLER_THIRD_PARTY,
                              COMMERCE_CONSUMPTION }
```

## 12.3 Value objects

- **Money** — monto con precisión de centavos; `plus`, `minus`, `isGreaterThan`, `toString`.
- **AccountNumber** — 9 dígitos con validación de formato.
- **LoanNumber** — 9 dígitos.
- **CardNumber** — 16 dígitos, expone `last4`.
- **ExpirationDate** — MM/AA con `isExpired()`.
- **InterestRate** — porcentaje válido con conversión anual → mensual.
- **Cvc** — generación aleatoria de 3 dígitos + hash SHA-256 y comparación.
- **Email**, **Cedula** — formato y normalización.
- **DateRange** — periodos de análisis para los dashboards.

## 12.4 Puertos (interfaces del dominio)

```ts
IUserRepository · ISavingsAccountRepository · ICreditCardRepository
ILoanRepository · IInstallmentRepository · ITransactionRepository
IConsumptionRepository · IBeneficiaryRepository · ICommerceRepository
IUnitOfWork · IPasswordHasher · IHashService · ITokenService
IEmailSender · ICache · IQueue · IUniqueNumberGenerator · IClock
```

## 12.5 Esquema relacional

```
users 1 ── * savings_accounts
users 1 ── * credit_cards
users 1 ── * loans
users 1 ── * beneficiaries
users 1 ── 0..1 commerces           (usuario del comercio)

loans            1 ── * amortization_installments
credit_cards     1 ── * card_consumptions
savings_accounts 1 ── * transactions
commerces        1 ── * card_consumptions
```

**Índices únicos obligatorios:** `savings_accounts.number`, `loans.number`, `credit_cards.number`, `users.username`, `users.email`.
**Índices de búsqueda:** `users.cedula`, `transactions.account_id + created_at`, `amortization_installments.loan_id + due_date`, `card_consumptions.card_id + created_at`.

**Notas de MySQL:**

- Todos los montos: `DECIMAL(18,2)`.
- Fechas en UTC con `DATETIME(3)`; conversión a zona local en el frontend.
- Los números de 9 dígitos se almacenan como `CHAR(9)` y los de 16 como `CHAR(16)` (conservan ceros a la izquierda).
- Motor InnoDB con claves foráneas y transacciones.

---

# 13. Procesos programados (Jobs)

**Cola:** BullMQ sobre Redis, ejecutada por `worker.ts` en un contenedor aparte.

| Job | Frecuencia | Descripción |
|---|---|---|
| `mark-overdue-installments` | Diario (cron) | Marca como atrasadas las cuotas no pagadas con fecha vencida (CU-33) |
| `send-email` | Bajo demanda | Envío de correos con reintentos y backoff exponencial |
| `refresh-dashboard-metrics` | Cada N minutos | Recalcula y cachea en Redis los indicadores costosos |

Requisitos: todos los jobs son **idempotentes**, tienen reintentos limitados y una cola muerta para inspección. Cada ejecución registra su resultado.

---

# 14. Catálogo de notificaciones por correo

| Evento | Destinatario | Asunto |
|---|---|---|
| Creación de usuario | Usuario | Activación de cuenta (enlace en la web / token en el cuerpo en la API) |
| Reseteo de contraseña | Usuario | Enlace con token / token en el cuerpo |
| Préstamo aprobado | Cliente | Aprobación con monto, plazo, tasa y cuota mensual |
| Cambio de tasa | Cliente | Nueva tasa y nuevo monto de la cuota |
| Cambio de límite de tarjeta | Cliente | Límite de la tarjeta [XXXX] modificado + nuevo límite |
| Transferencia (emisor) | Cliente emisor | `Transacción realizada a la cuenta [XXXX]` |
| Transferencia (receptor) | Cliente receptor | `Transacción enviada desde la cuenta [XXXX]` |
| Pago a tarjeta | Cliente | `Pago realizado a la tarjeta [XXXX]` |
| Pago a préstamo | Cliente | `Pago realizado al préstamo [XXXXXXXXX]` |
| Avance de efectivo | Cliente | `Avance de efectivo desde la tarjeta [XXXX]` |
| Depósito por cajero | Cliente | `Depósito realizado a su cuenta [XXXX]` |
| Retiro por cajero | Cliente | `Retiro realizado a su cuenta [XXXX]` |
| Consumo en comercio | Cliente | `Consumo realizado con la tarjeta [XXXX]` |
| Pago recibido (Hermes Pay) | Comercio | `Pago recibido a través de tarjeta [XXXX]` |

Todo correo transaccional incluye **monto**, **identificador enmascarado del producto** y **fecha y hora exacta**.

---

# 15. Frontend (React)

## 15.1 Rutas por rol

```
/login                         público
/activate?token=...            público
/reset-password?token=...      público

/admin                         dashboard
/admin/users                   listado, crear, editar, activar/inactivar
/admin/loans                   listado · /assign (paso 1) · /assign/config (paso 2)
/admin/loans/:id               tabla de amortización
/admin/loans/:id/edit          tasa
/admin/cards                   listado · /assign · /assign/config
/admin/cards/:id               consumos
/admin/cards/:id/edit          límite
/admin/cards/:id/cancel        confirmación
/admin/accounts                listado · /assign · /assign/config
/admin/accounts/:number        transacciones
/admin/accounts/:number/cancel confirmación

/teller                        dashboard del día
/teller/deposit · /withdrawal · /card-payment · /loan-payment · /third-party
/teller/confirm                pantalla de confirmación con titular

/client                        home de productos
/client/accounts/:number       transacciones
/client/loans/:id              amortización
/client/cards/:id              consumos
/client/beneficiaries
/client/transactions/express · /card · /loan · /beneficiary
/client/cash-advance
/client/transfer
```

## 15.2 Lineamientos

- **Guards de ruta** por rol: sin sesión → `/login`; rol incorrecto → pantalla de acceso denegado con enlace al Home propio.
- **TanStack Query** para datos del servidor; invalidación tras cada operación que mueve dinero.
- **React Hook Form + Zod**, con los mismos esquemas de validación compartidos con el backend donde sea posible.
- **Pantallas de confirmación** implementadas como paso real (ruta o modal) que consume el endpoint `/validate` correspondiente.
- **Formateo de moneda** en RD$ con dos decimales; los montos llegan como string y nunca se convierten a `number` antes de mostrarse.
- Listados con paginación de 20, buscadores y filtros tal como se definen en la sección 8.
- Estados de carga, vacío y error explícitos en cada listado.

---

# 16. Estrategia de testing

- **Unit (dominio)**: cuota francesa, generación de la tabla de amortización, interés de avance (6.25%), crédito disponible, regla de no sobrepago, evaluación de riesgo, `Money` y demás value objects, generación de números únicos.
- **Unit (aplicación)**: casos de uso con repositorios simulados — asignación de préstamo, aplicación secuencial de pago a cuotas con excedente, cancelación de cuenta con traspaso de saldo.
- **Integración**: repositorios contra MySQL real (Testcontainers), unicidad de identificadores, atomicidad y rollback, bloqueo de balances bajo concurrencia, job de cuotas atrasadas, cache en Redis.
- **E2E (Supertest)**: login y activación, reseteo de contraseña, creación de cliente con cuenta principal, asignación de préstamo con desembolso, transferencia express, avance de efectivo, pago a préstamo con excedente, cobro Hermes Pay.
- **Security tests**: 401 sin token, 403 con rol incorrecto, acceso cruzado entre clientes, imposibilidad de auto-inactivación del administrador, rate limiting de login.
- **Contract tests** para Hermes Pay (consumidores externos).

---

# 17. Plan de desarrollo por fases

**Fase 0 — Cimientos**
Monorepo y Docker Compose (api, worker, mysql, redis, web) · TypeScript estricto, ESLint, Prettier · Esquema Prisma inicial y migraciones · `app.ts` / `server.ts` / `bootstrap.ts` · Value objects `Money`, `AccountNumber`, `CardNumber` · Repositorios genéricos y Unit of Work · Manejo centralizado de errores · Logger y health checks · Seeds de roles y usuarios.

**Fase 1 — Identidad**
Login con JWT + refresh · Middlewares `auth` y `requireRole` · Activación por correo · Reseteo de contraseña · Rate limiting en Redis · Guards de ruta y layouts por rol en React.

**Fase 2 — Usuarios y cuentas**
CRUD de usuarios con paginación y filtros · Creación de cliente con cuenta principal · Monto adicional · Gestión de cuentas de ahorro con cancelación y traspaso de saldo.

**Fase 3 — Motor transaccional**
Entidad `Transaction` y registro estandarizado · Unit of Work con bloqueo de balances · Transferencia entre cuentas propias · Transferencia express con pantalla de confirmación · Beneficiarios · Historial completo con todos los casos de origen/beneficiario.

**Fase 4 — Tarjetas de crédito**
Emisión con número único, CVC hasheado y expiración · Consumos y deuda · Pago con regla de no sobrepago · Avance de efectivo con 6.25% · Edición de límite y cancelación.

**Fase 5 — Préstamos**
Calculadora de amortización francesa con pruebas unitarias · Flujo de asignación en dos pasos con evaluación de riesgo · Desembolso · Pago secuencial con excedente · Edición de tasa · Job de cuotas atrasadas con BullMQ.

**Fase 6 — Cajero**
Depósito, retiro, pagos y transacciones a terceros · Indicadores del día por cajero.

**Fase 7 — Dashboards**
Indicadores del administrador con caching en Redis, incluida la deuda promedio.

**Fase 8 — Comercios y Hermes Pay**
CRUD de comercios con desactivación en cascada · Usuario de comercio con cuenta principal · Consulta de transacciones del comercio · Procesamiento de pagos con validación completa de tarjeta · OpenAPI/Swagger completo.

**Fase 9 — Cierre**
Suite de pruebas completa · Revisión de reglas de dependencia · Documentación, ADRs y guía de despliegue · CI/CD.

---

# 18. Criterios de éxito

- Ningún balance queda inconsistente tras una operación, exitosa o fallida.
- Toda operación que mueve dinero deja un registro con origen, beneficiario, tipo y estado correctos.
- Ningún rol accede a funcionalidades de otro rol, ni en la web ni en la API.
- Un cliente nunca ve ni opera información de otro cliente, aunque conozca su identificador.
- La tabla de amortización coincide con el sistema francés hasta el centavo.
- Un cliente solo puede tener un préstamo activo a la vez.
- Ninguna tarjeta queda con deuda mayor a su límite.
- Ninguna tarjeta ni cuenta se cancela violando sus reglas.
- No existe ningún cálculo monetario hecho con punto flotante.
- Los correos se envían en todos los eventos del catálogo de la sección 14.
- El dominio compila y se prueba sin importar nada de infraestructura.
- El sistema puede cambiar de implementación de persistencia sin reescribir casos de uso.
- El proyecto se levanta completo con `docker compose up` y cuenta con documentación suficiente.

---

# 19. Roadmap futuro

- Estados de cuenta mensuales en PDF enviados automáticamente.
- Débito automático de cuotas desde la cuenta principal.
- Reversión y anulación de transacciones con auditoría.
- Multimoneda con tasas de cambio.
- Notificaciones push y WhatsApp además del correo.
- 2FA para operaciones sensibles.
- Portal web para comercios además de la API.
- Detección de consumos inusuales en tarjetas.
- Aplicación móvil / PWA para el cliente.
- Webhooks para comercios (notificación de cobros en tiempo real).
