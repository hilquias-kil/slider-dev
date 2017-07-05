export default function extend (o, p) {
	for(var prop in p) {
		o[prop] = p[prop];
	}
	return o;
};
