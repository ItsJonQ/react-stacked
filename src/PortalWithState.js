import React from 'react';
import { Portal } from 'react-portal';
import {
	noop,
	asyncNoop,
	createUniqueIdFactory,
	eventPreventDefault,
	eventStopPropagation,
} from './utils';
import { PortalManager } from './PortalManager';

const portalId = createUniqueIdFactory('portal');

const KEYCODES = {
	ESCAPE: 27,
};

const defaultProps = {
	closeOnEsc: true,
	closeOnOutsideClick: true,
	onBeforeClose: asyncNoop,
	onBeforeOpen: asyncNoop,
	onClose: noop,
	onOpen: noop,
};

export class PortalWithState extends React.Component {
	portalNode = null;
	state = { portalId: portalId(), active: !!this.props.defaultOpen };

	componentDidMount() {
		if (this.props.closeOnEsc) {
			document.addEventListener('keydown', this.handleKeydown);
		}
		if (this.props.closeOnOutsideClick) {
			document.addEventListener('click', this.handleOutsideMouseClick);
		}
	}

	componentWillUnmount() {
		if (this.props.closeOnEsc) {
			document.removeEventListener('keydown', this.handleKeydown);
		}
		if (this.props.closeOnOutsideClick) {
			document.removeEventListener('click', this.handleOutsideMouseClick);
		}
	}

	getRootNode = () => {
		return (
			this.portalNode &&
			(this.portalNode.props.node || this.portalNode.defaultNode)
		);
	};

	isLast = () => {
		return PortalManager.isLast(this.state.portalId);
	};

	openPortalImmediately = event => {
		eventStopPropagation(event);
		this.setState({ active: true }, this.props.onOpen);

		PortalManager.add(this.state.portalId, this);
	};

	closePortalImmediately = event => {
		eventStopPropagation(event);
		this.setState({ active: false }, this.props.onClose);

		PortalManager.remove(this.state.portalId);
	};

	openPortal = event => {
		eventStopPropagation(event);

		if (this.state.active) return;

		this.props.onBeforeOpen().then(() => {
			this.openPortalImmediately();
		});
	};

	closePortal = event => {
		eventStopPropagation(event);

		if (!this.state.active) return;
		if (!this.isLast()) return;

		this.props.onBeforeClose().then(() => {
			eventPreventDefault(event);
			this.closePortalImmediately();
		});
	};

	wrapWithPortal = children => {
		if (!this.state.active) return null;

		return (
			<Portal
				node={this.props.node}
				key="react-portal"
				ref={portalNode => (this.portalNode = portalNode)}
			>
				{children}
			</Portal>
		);
	};

	handleOutsideMouseClick = event => {
		if (!this.state.active) return;

		const root = this.getRootNode();
		const isSourceInside = root.contains(event.target);
		const isButtonRightClick = event.button && event.button !== 0;

		if (!root || isSourceInside || isButtonRightClick) {
			return;
		}

		this.closePortal(event);
	};

	handleKeydown = event => {
		if (event.keyCode === KEYCODES.ESCAPE && this.state.active) {
			this.closePortal(event);
		}
	};

	render() {
		return this.props.children({
			closePortal: this.closePortal,
			closePortalImmediately: this.closePortalImmediately,
			isOpen: this.state.active,
			portalId: this.state.portalId,
			openPortal: this.openPortal,
			openPortalImmediately: this.openPortalImmediately,
			portal: this.wrapWithPortal,
		});
	}
}

PortalWithState.defaultProps = defaultProps;

export default PortalWithState;
