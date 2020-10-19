const URL_BASE = {
	USER: "/auth",
}

const ROUTES_USER = {
	REGISTER: "/register",
}

const ROUTE_MAP = {
	USER: {
		REGISTER: { PATH: URL_BASE.USER + ROUTES_USER.REGISTER, METHOD: "POST" },
    },
}

module.exports = ROUTE_MAP
