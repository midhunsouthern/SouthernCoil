//import { read, utils, writeFileXLSX } from 'xlsx';
import { saveAs } from "file-saver";
import XlsxPopulate from "xlsx-populate";
import orderListLabelId from "./orderListLabelId.json";
import OrderHistory from "../components/Tables/OrderHistory";

export const handleSize = (length, height, row, quantity) => {
	const len = length === null ? 0 : length;
	const heig = height === null ? 0 : height;
	const rowval = row === null ? 0 : row;
	const qty = quantity === null ? 0 : quantity;

	return (
		String(len) +
		" x " +
		String(heig) +
		" x " +
		String(rowval) +
		"R - " +
		String(qty)
	);
};

export const handleSqFeet = (length, height, row, quantity) => {
	return Math.round((length * height * row * quantity) / 144);
};

export const handleInput_Check = (inputList, value, checked) => {
	const list = inputList;
	const index = list.indexOf(value);
	if (checked && index === -1) {
		list.push(value);
	} else if (!checked && index >= 0) {
		list.splice(index, 1);
	}
	return list;
};

export const handleFindLookup_arr = (lookUpList, lkpCat, lkpIds) => {
	let retVal = "";
	const lkparr = lkpIds?.split(",");
	retVal = lkparr?.map((a) => {
		let ret = lookUpList[lkpCat]?.find((i) => i.id === a)?.lkp_value;
		return ret !== undefined ? ret + " ; " : "";
	});

	return retVal;
};

export const handleFindCoverDetailLookup_arr = (lookUpList, lkpIds) => {
	let retVal = [];
	const lkparr = lkpIds.split(",");
	retVal = lkparr?.map((a) => {
		let ret = lookUpList["coverDetail"]?.find((i) => i.id === a);
		return ret !== undefined
			? ret?.lkp_value + " => " + ret?.sublkp_val + ";"
			: "";
	});
	return retVal;
};

export const handlePipeQty = (data) => {
	if (data === null) {
		return;
	}
	let retVal, retVal1, retVal2, retVal3, retVal4;
	if (data.pbStraight === "true") {
		retVal1 =
			"Straight - " +
			data.pbStraightSize +
			" - " +
			data.pbStraightTotQty +
			"Nos";
	}
	if (data.pbSingle === "true") {
		retVal2 =
			"Single - " + data.pbSingleSize + " - " + data.pbSingleTotQty + "Nos";
	}
	if (data.pbCross === "true") {
		retVal3 =
			"Cross - " + data.pbCrossSize + " - " + data.pbCrossTotQty + "Nos";
	}
	if (data.pbOther === "true") {
		retVal4 =
			"Other - " + data.pbOtherSize + " - " + data.pbOtherTotQty + "Nos";
	}
	retVal1 = retVal1 !== undefined ? retVal1 : "";
	retVal2 = retVal2 !== undefined ? retVal2 : "";
	retVal3 = retVal3 !== undefined ? retVal3 : "";
	retVal4 = retVal4 !== undefined ? retVal4 : "";
	retVal = retVal1 + " " + retVal2 + " " + retVal3 + " " + retVal4;
	return retVal;
};

function getSheetData(data, header) {
	var fields = Object.keys(data[0]);
	var sheetData = data.map(function (row) {
		return fields.map(function (fieldName) {
			return row[fieldName] ? row[fieldName] : "";
		});
	});
	sheetData.unshift(header);
	return sheetData;
}

export async function saveAsExcel(data, filename = "scui") {
	let header = [];
	for (var keyRefData in data[0]) {
		var orderlbl = orderListLabelId.filter((lblId) => lblId.id === keyRefData);
		if (orderlbl.length === 0) {
			header.push(keyRefData);
		} else {
			header.push(orderlbl[0].label);
		}
	}
	XlsxPopulate.fromBlankAsync().then(async (workbook) => {
		const sheet1 = workbook.sheet(0);
		const sheetData = getSheetData(data, header);
		//const totalColumns = sheetData[0].length;
		sheet1.cell("A1").value(sheetData);
		const range = sheet1.usedRange();
		//const endColumn = String.fromCharCode(64 + totalColumns);
		sheet1.row(1).style("bold", true);
		sheet1.range("A1:BZ1").style("fill", "BFBFBF");
		range.style("border", true);
		return workbook.outputAsync().then((res) => {
			saveAs(res, filename + ".xlsx");
		});
	});
}
