"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
(async () => {
    const app = await (0, app_1.createApp)();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})();
