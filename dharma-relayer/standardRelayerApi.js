const url = require("url");

const addStandardRelayerApi = (server, router) => {
    server.post("/v0/debt_order", (req, res) => {
        res.redirect(307, "/loanRequests");
    });

    server.get("/v0/debt_order/:agreementId", (req, res) => {
        const agreementId = req.params.agreementId;

        const redirectUrl = url.format({
            pathname: `/loanRequests/${agreementId}`,
            query: {
                standardize: true,
            },
        });

        res.redirect(redirectUrl);
    });

    server.get("/v0/debt_orders", (req, res) => {
        const originalQuery = req.query;

        const redirectUrl = url.format({
            pathname: "/loanRequests",
            query: {
                ...originalQuery,
                standardize: true,
            },
        });

        res.redirect(redirectUrl);
    });

    // correctly format POST requests that are redirected from the Standard Relayer API
    server.use((req, res, next) => {
        if (req.method === "POST" && req.path === "/loanRequests" && req.body.debtOrder) {
            req.body = req.body.debtOrder;
        }

        next();
    });

    // reformat responses returned by the Standard Relayer API
    router.render = (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const query = parsedUrl.query;

        if (req.method === "GET" && req.path === "/loanRequests" && query.standardize) {
            const debtOrders = res.locals.data.map((loanRequest) => {
                return {
                    debtOrder: loanRequest,
                    metaData: { agreementId: loanRequest.id },
                };
            });

            res.jsonp({
                total: debtOrders.length,
                page: 1,
                perPage: debtOrders.length,
                debtOrders,
            });
        } else if (
            req.method === "GET" &&
            req.path.match(/loanRequests\/(\d+)/) &&
            query.standardize
        ) {
            const loanRequest = res.locals.data;

            res.jsonp({
                debtOrder: loanRequest,
                metaData: { agreementId: loanRequest.id },
            });
        } else {
            res.jsonp(res.locals.data);
        }
    };
};

module.exports = { addStandardRelayerApi };
