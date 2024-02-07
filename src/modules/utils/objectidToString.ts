import { Types } from 'mongoose';

export function recurisveObjectIdStringifyer(o: any) {
	if (typeof o == 'object' && o != null) {
		if (o instanceof Types.ObjectId) {
			o = o.toString();
		} else if (Array.isArray(o)) {
			for (const k in o) {
				o[k] = recurisveObjectIdStringifyer(o[k]);
			}
		} else {
			for (const k of Object.keys(o)) {
				o[k] = recurisveObjectIdStringifyer(o[k]);
			}
		}
	}
	return o;
};