/*  Function to test if an object is a plain object, i.e. is constructed
 **  by the built-in Object constructor and inherits directly from Object.prototype
 **  or null. Some built-in objects pass the test, e.g. Math which is a plain object
 **  and some host or exotic objects may pass also.
 **
 **  @param {} obj - value to test
 **  @returns {Boolean} true if passes tests, false otherwise
 */
 function isPlainObject(obj: any) {
	// Basic check for Type object that's not null
	if (typeof obj === 'object' && obj !== null) {
		// If Object.getPrototypeOf supported, use it
		if (typeof Object.getPrototypeOf == 'function') {
			var proto = Object.getPrototypeOf(obj);
			return proto === Object.prototype || proto === null;
		}

		// Otherwise, use internal class
		// This should be reliable as if getPrototypeOf not supported, is pre-ES5
		return Object.prototype.toString.call(obj) === '[object Object]';
	}

	// Not an object
	return false;
}

function classNames(...classes: any[]) {
	if (!classes || classes.length === 0) return undefined;
	const classesSet = classes.reduce<Set<string>>((prev, className) => {
		if (!className) return prev;
		if (typeof className === 'string') return prev.add(className);
		if (Array.isArray(className)) {
			for (const cls of className) {
				if (cls) {
					if (typeof cls === 'string') prev.add(cls);
					if (isPlainObject(cls)) {
						for (const key in cls) {
							if (cls[key]) prev.add(key);
						}
						return prev;
					}
				}
			}
			return prev;
		}
		if (isPlainObject(className)) {
			for (const key in className) {
				if (className[key]) prev.add(key);
			}
			return prev;
		}
		return prev;
	}, new Set());
	return classesSet.size > 0 ? Array.from(classesSet).join(' ') : undefined;
}

export default classNames;
