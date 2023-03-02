import { Geometry } from "geojson";
import {
	HomeOutlined,
	MapOutlined,
	TableChartOutlined,
} from "@mui/icons-material";

export type LatLngExpression = [number, number];

export type LatLngBoundsExpression = [LatLngExpression, LatLngExpression];

export type BoundType = "square" | "circle" | "diamond" | "none";

export type MarkerTypes = "dot" | "marker" | "none";

export enum OverlayState {
	HOME,
	TABLE,
	MAP_SEARCHED,
	MAP_FREE_ROAM,
	ABOUT,
}

export const toNumberVals = [
	"stop_id",
	"stop_code",
	"stop_lon",
	"stop_lat",
	"geonamesId",
]; // Values that should be converted to numbers

export const toRemoveVals = [
	"zone_id",
	"stop_desc",
	"population2010",
	"government",
	"type",
]; // Values to be removed from datasets

export const STARTING_POS_NJ: LatLngExpression = [40.0583, -76.5057];
// Center of NJ - [40.0583, -74.4057]
// Atlantic City test coorrds - [39.354349, -74.44707]
export const VIEWPORT_MARKER_LIMIT = 3000;

export const STARTING_ZOOM = 8.4;
// close zoom test - 16

export type TStopRow = {
	stop_id: string;
	stop_name: string;
	stop_lat: number;
	stop_lon: number;
	stop_code: string;
};

export type TStopData = TStopRow[];

export type TMuniciplaityRow = {
	geonamesId: number;
	name: string;
	county: string;
};

export type TMunicipalityData = TMuniciplaityRow[];
export interface IMapProps {
	stopsData: TStopData;
	overlayState: IOverlayStateProps;
	displayOptions: IDisplayOptions;
}

export interface IOverlayProps {
	displayOptions: IDisplayOptions;
	setDisplayOptions: React.Dispatch<React.SetStateAction<IDisplayOptions>>;
	municipalityData: TMunicipalityData;
	stopsData: TStopData;
	overlayState: IOverlayStateProps;
	setOverlayState: React.Dispatch<React.SetStateAction<IOverlayStateProps>>;
}

export interface IOverlayStateProps {
	overlayState: OverlayState;
	boundingLatLngs?: L.GeoJSON<any, Geometry> | undefined;
}

export interface IDisplayOptions {
	boundType: BoundType; // radiusType | boundType - interchangeable
	markerType: MarkerTypes;
	municipalityInfo: TMuniciplaityRow | undefined;
	markerLimit?: number;
}

export interface ISidebarOptions {
	icon: any; // provided by mui
	label: string;
	overlayState: OverlayState;
}

export interface ISidebarProps {
	stopsData: TStopData;
	setOverlayState: React.Dispatch<React.SetStateAction<IOverlayStateProps>>;
	overlayState: IOverlayStateProps;
	municipalityData: TMunicipalityData;
	displayOptions: IDisplayOptions;
	setDisplayOptions: React.Dispatch<React.SetStateAction<IDisplayOptions>>;
	onSelectChange: (event: any) => void;
	searchText: string;
	onSearchChange: (event: any) => void;
	onGoClick: () => Promise<void>;
	setShowFilteringMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarOptions: ISidebarOptions[] = [
	{ icon: HomeOutlined, label: "Home", overlayState: OverlayState.HOME },
	{
		icon: MapOutlined,
		label: "Map",
		overlayState: OverlayState.MAP_FREE_ROAM,
	},
	{
		icon: TableChartOutlined,
		label: "Table",
		overlayState: OverlayState.TABLE,
	},
];

export const RadiusStyleOptions: {
	boundType: BoundType;
	label: string;
}[] = [
	{
		boundType: "diamond",
		label: "Diamond",
	},
	{
		boundType: "circle",
		label: "Circle",
	},
	{
		boundType: "square",
		label: "Square",
	},
	{
		boundType: "none",
		label: "None",
	},
];

export const MarkerStyleOptions: {
	markerType: MarkerTypes;
	label: string;
}[] = [
	{
		markerType: "dot",
		label: "Dot",
	},
	{
		markerType: "marker",
		label: "Marker",
	},
	{
		markerType: "none",
		label: "None",
	},
];
