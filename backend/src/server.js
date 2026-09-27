const config = require("./Infrastructure/Config/config");
const app = require("./app");

const PORT = config.server.port || 7200;

const startServer = () => {
    app.listen(PORT, ()=> {
        console.log(`Server is running on port: ${PORT}`);
    })
}

startServer();