export function noop() {
	return undefined;
}

export function asyncNoop() {
	return new Promise(resolve => resolve());
}

export function createUniqueIdFactory(prefix = '') {
	let index = 0;
	return () => `${prefix}-${index++}`;
}

export function eventStopPropagation(event) {
	if (event && event.nativeEvent) {
		event.nativeEvent.stopImmediatePropagation();
	}
}

export function eventPreventDefault(event) {
	if (event && event.preventDefault) {
		event.preventDefault();
	}
}
