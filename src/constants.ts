export type LatLngExpression = [number, number];

export type LatLngBoundsExpression = [LatLngExpression, LatLngExpression];

export type BoundType = "square" | "circle" | "diamond";

export const toNumberVals = ["stop_id", "stop_code", "stop_lon", "stop_lat"]; // Values that should be converted to numbers

export const toRemoveVals = ["zone_id", "stop_desc"]; // Values to be removed from datasets

export const STARTING_POS_NJ: LatLngExpression = [39.354349, -74.44707];
// [40.0583, -74.4057]
export const STARTING_ZOOM = 16;
//8.4;

export type TStopRow = {
	stop_id: string;
	stop_name: string;
	stop_lat: number;
	stop_lon: number;
	stop_code: string;
};

export type TStopData = TStopRow[];
