import { useCallback, useEffect, useState } from "react";
import { LatLngBoundsExpression, TStopRow } from "../constants";
import { useMap, Marker, Popup, Polygon } from "react-leaflet";
import { getRectBounds } from "../utils";
import React from "react";
import L from "leaflet";

const rendererOption = L.canvas({ padding: 0.5 });

export const CustomMarker = (stop: TStopRow): JSX.Element => {
	const [renderMarker, setRenderMarker] = useState(true); // hide / show marker if in view
	const [showMarker, setShowMarker] = useState(true); // show custom marker or circle marker

	const map = useMap();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const isWithinView = () =>
		setRenderMarker(
			map.getBounds().contains([stop.stop_lat, stop.stop_lon])
		);

	const minimizeMarkers = useCallback(
		() => setShowMarker(map.getZoom() > 13),
		[map]
	);

	const onMoveHandler = useCallback(() => {
		isWithinView();
		minimizeMarkers();
	}, [isWithinView, minimizeMarkers]);

	useEffect(() => {
		map.on("move", onMoveHandler);
		return () => {
			map.off("move", onMoveHandler);
		};
	}, [map, isWithinView, onMoveHandler]);

	const rectBounds = getRectBounds([stop.stop_lat, stop.stop_lon], "diamond");

	if (!renderMarker) return <React.Fragment />;

	if (!showMarker) {
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
