import { BoundType, LatLngExpression } from "./constants";
import circle from "@turf/circle";
import { Units, Position } from "@turf/helpers";

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
		default:
			return [allCoords[0], allCoords[24], allCoords[49], allCoords[74]];
	}
};
