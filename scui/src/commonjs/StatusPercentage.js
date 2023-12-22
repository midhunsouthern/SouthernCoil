export default function statusPercentage(prop) {
	const statusData = {
		cncnesting: prop.cnc_nesting_status,
		cncpunching: prop.cnc_punching_status,
		epBending: prop.bending_status ?? "false",
		tcutting: prop.tcutting_status ?? "false",
		finpunching: prop.finpunch_status ?? "false",
		ca: prop.ca_status,
		ce: prop.ce_status,
		bnl: prop.brazing_status,
		pp: prop.pp_status,
		disp: prop.dispatch_status,
	};

	let status = 0;
	status =
		(statusData.cncnesting === "true" ? 10 : 0) +
		(statusData.cncpunching === "true" ? 10 : 0) +
		(statusData.epBending === "true" ? 10 : 0) +
		(statusData.tcutting === "true" ? 10 : 0) +
		(statusData.finpunching === "true" ? 10 : 0) +
		(statusData.ca === "true" ? 10 : 0) +
		(statusData.ce === "true" ? 10 : 0) +
		(statusData.bnl === "true" ? 10 : 0) +
		(statusData.pp === "true" ? 10 : 0) +
		(statusData.disp === "true" ? 10 : 0);
	return status;
}
