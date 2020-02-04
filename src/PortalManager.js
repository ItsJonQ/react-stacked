class BasePortalManager {
	state = {};

	add = (portalId, portal) => {
		if (!this.state[portalId]) {
			this.state[portalId] = portal;
			console.log(this.state);
		}
	};

	remove = portalId => {
		if (this.state[portalId]) {
			delete this.state[portalId];
		}
	};

	isLast = portalId => {
		const entries = Object.keys(this.state);
		const isLast = entries[entries.length - 1] === portalId;

		return isLast;
	};
}

export const PortalManager = new BasePortalManager();
