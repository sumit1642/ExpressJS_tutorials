export const requestPreProcessor = (req, res, next) => {
	if (req.params.id) {
		const parsedId = parseInt(req.params.id);
		if (isNaN(parsedId) || parsedId <= 0) {
			return res.status(400).json({ msg: "Provide a valid id" });
		}
		req.parsedId = parsedId; // Store parsed ID for easy access in routes
	}

	next();
};
