/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

export function createDecorator(mapFn: (fn: Function) => Function): Function {
	return (target: any, key: string, descriptor: any) => {
		let fnKey: string = null;
		let fn: Function = null;

		if (typeof descriptor.value === 'function') {
			fnKey = 'value';
			fn = descriptor.value;
		} else if (typeof descriptor.get === 'function') {
			fnKey = 'get';
			fn = descriptor.get;
		}

		if (!fn) {
			throw new Error('not supported');
		}

		descriptor[fnKey] = mapFn(fn);
	};
}

export function memoize(target: any, key: string, descriptor: any) {
	let fnKey: string = null;
	let fn: Function = null;

	if (typeof descriptor.value === 'function') {
		fnKey = 'value';
		fn = descriptor.value;
	} else if (typeof descriptor.get === 'function') {
		fnKey = 'get';
		fn = descriptor.get;
	}

	if (!fn) {
		throw new Error('not supported');
	}

	const memoizeKey = `$memoize$${key}`;

	descriptor[fnKey] = function (...args: any[]) {
		if (!this.hasOwnProperty(memoizeKey)) {
			Object.defineProperty(this, memoizeKey, {
				configurable: false,
				enumerable: false,
				writable: false,
				value: fn.apply(this, args)
			});
		}

		return this[memoizeKey];
	};
}