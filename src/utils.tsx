import {
	BoundType,
	LatLngExpression,
	toNumberVals,
	toRemoveVals,
} from "./constants";
import circle from "@turf/circle";
import { Units, Position } from "@turf/helpers";
import Papa, { ParseResult } from "papaparse";
import { useMapEvent } from "react-leaflet";
import React from "react";

const RADIUS = 0.25;
const STEPS = 100;

export const getRectBounds = (
	[lat, lng]: LatLngExpression,
	boundType?: BoundType
): Position[] => {
	const center = [lng, lat];
	const options = {
		steps: STEPS,
		units: "miles" as Units,
	};

	// idk why but turf returns coords in [lng, lat] order so i gotta reverse this shit... or maybe i'm just dumb who knows
	const allCoords = circle(
		center,
		RADIUS,
		options
	).geometry.coordinates[0].map((coord) => [coord[1], coord[0]]);

	switch (boundType) {
		case "circle":
			return allCoords;
		case "square":
			return [allCoords[12], allCoords[37], allCoords[62], allCoords[87]];
		case "diamond":
			return [allCoords[0], allCoords[24], allCoords[49], allCoords[74]];
		default:
			return [];
	}
};

export const loadCSV = async (
	path: string,
	setState: React.Dispatch<React.SetStateAction<any>>
) => {
	try {
		Papa.parse(`/data/${path}.csv`, {
			header: true,
			download: true,
			skipEmptyLines: true,
			delimiter: ",",
			complete: (r: ParseResult<any>) =>
				setState(cleanAndFormatCSV(r.data)),
		});
	} catch (e) {
		console.error(`Error parsing CSV: ${e}`);
	} finally {
		return;
	}
};

const cleanAndFormatCSV = (d: any[]) =>
	d.map((row) => {
		Object.keys(row).forEach((key) => {
			if (toNumberVals.includes(key)) {
				row[key] = Number(row[key]);
			} else if (toRemoveVals.includes(key)) {
				delete row[key];
			}
		});

		return row;
	});

export function SetViewOnClick({
	clickPanningRef,
}: {
	clickPanningRef: React.MutableRefObject<boolean>;
}) {
	// uncomment this to enable animated click panning - disabling as clicking on overlay panels moves map unintentionally

	// const map = useMapEvent("click", (e) => {
	// 	map.setView(e.latlng, map.getZoom(), {
	// 		animate: clickPanningRef.current || false,
	// 	});
	// });

	return <React.Fragment />;
}
