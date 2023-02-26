import { useCallback, useEffect, useRef } from "react";
import { useMap, TileLayer } from "react-leaflet";
import styled from "styled-components";
import {
	IMapProps,
	OverlayState,
	STARTING_POS_NJ,
	STARTING_ZOOM,
	TStopRow,
	VIEWPORT_MARKER_LIMIT,
} from "./constants";
import { CustomMarker } from "./components/CustomMarker";
import { SetViewOnClick } from "./utils";
import React from "react";

export const Map = ({
	stopsData,
	overlayState,
	displayOptions,
}: IMapProps): JSX.Element => {
	// const [markerLim] = React.useState<number>(VIEWPORT_MARKER_LIMIT); // TODO: add slider val

	const [mapBounds, setMapBounds] = React.useState<any>(null);
	const clickPanningRef = useRef(false);
	clickPanningRef.current = true;
	const showMarkers =
		overlayState.overlayState !== OverlayState.HOME &&
		overlayState.overlayState !== OverlayState.TABLE &&
		displayOptions.markerType !== "none";

	const map = useMap();

	const onMoveHandler = useCallback(
		() =>
			setMapBounds(
				overlayState.boundingLatLngs &&
					overlayState.overlayState === OverlayState.MAP_SEARCHED
					? overlayState.boundingLatLngs.getBounds()
					: map.getBounds()
			),
		[map, overlayState.boundingLatLngs, overlayState.overlayState]
	);

	useEffect(() => {
		map.on("move", onMoveHandler);
		return () => {
			map.off("move", onMoveHandler);
		};
	}, [map, onMoveHandler, overlayState]);

	return (
		<React.Fragment>
			{/* This is a custom hook animates map panning */}
			<SetViewOnClick clickPanningRef={clickPanningRef} />

			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			{!!stopsData?.length && showMarkers
				? stopsData
						.slice(0, 1000) // uncomment to remove limit of markers... at your own peril
						.map((stop: TStopRow) => {
							const withinBounds = mapBounds?.contains([
								stop.stop_lat,
								stop.stop_lon,
							]);

							if (withinBounds) {
								return (
									<CustomMarker
										key={stop.stop_id}
										stop={stop}
										displayOptions={displayOptions}
									/>
								);
							}
							return <React.Fragment />;
						})
				: null}
		</React.Fragment>
	);
};
