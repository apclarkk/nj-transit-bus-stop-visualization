import { useCallback, useEffect, useState } from "react";
import {
	IDisplayOptions,
	LatLngBoundsExpression,
	TStopRow,
} from "../constants";
import { useMap, Marker, Popup, Polygon } from "react-leaflet";
import { getRectBounds } from "../utils";
import React from "react";
import L from "leaflet";

const rendererOption = L.canvas({ padding: 0.5 });
interface ICustomMarkerProps {
	stop: TStopRow;
	displayOptions: IDisplayOptions;
}

export const CustomMarker = ({
	displayOptions,
	stop,
}: ICustomMarkerProps): JSX.Element => {
	const [showMarker, setShowMarker] = useState(true); // show custom marker or circle marker
	const { boundType, markerType } = displayOptions;
	const map = useMap();

	const minimizeMarkers = useCallback(
		() => setShowMarker(map.getZoom() > 13),
		[map]
	);

	useEffect(() => {
		map.on("move", minimizeMarkers);
		return () => {
			map.off("move", minimizeMarkers);
		};
	}, [map, minimizeMarkers]);

	const rectBounds = getRectBounds([stop.stop_lat, stop.stop_lon], boundType);

	if (markerType === "none") return <React.Fragment />;

	if (!showMarker || markerType === "dot") {
		// need to add circle markers via leaflet's canvas renderer and not react-leaflet
		L.circleMarker([stop.stop_lat, stop.stop_lon], {
			radius: 5,
			renderer: rendererOption,
		}).addTo(map);
		return <React.Fragment />;
	}

	return (
		<Polygon
			key={stop.stop_id}
			{...(!!rectBounds && {
				positions: rectBounds as LatLngBoundsExpression,
			})}
		>
			<Marker
				position={[stop.stop_lat, stop.stop_lon]}
				icon={L.icon({
					iconUrl: "custom_marker.png",
					iconSize: [38, 58],
				})}
			>
				<Popup>
					{`${stop.stop_id}: ${stop.stop_name}`}
					<br />
					{`${stop.stop_lat},${stop.stop_lon}`}
				</Popup>
			</Marker>
		</Polygon>
	);
};
