import React, { useState } from 'react';
import { PortalWithState } from '../src';
export default {
	title: 'Stacked',
};

const PortalContent = ({
	openPortal,
	closePortalImmediately,
	closePortal,
	isOpen,
	portal,
	portalId,
}) => {
	return (
		<>
			<button onClick={openPortal}>Toggle</button>
			{portal(
				<>
					<h1>{portalId}</h1>
					<p>
						This is more advanced Portal. It handles its own state.{' '}
						<button onClick={closePortalImmediately}>
							Close me!
						</button>
						, hit ESC or click outside of me.
					</p>
				</>,
			)}
		</>
	);
};

const Example = () => {
	return (
		<>
			<PortalWithState>{PortalContent}</PortalWithState>
			<PortalWithState>{PortalContent}</PortalWithState>
			<PortalWithState>{PortalContent}</PortalWithState>
			<PortalWithState>{PortalContent}</PortalWithState>
		</>
	);
};

export const _default = () => {
	return <Example />;
};
