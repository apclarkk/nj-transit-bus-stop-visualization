import React, { useEffect, useRef, useState } from "react";
import {
	MapContainer,
	TileLayer,
	useMapEvent,
	useMap,
	Marker,
	Popup,
	Polygon,
} from "react-leaflet";
import styled from "styled-components";
import Papa, { ParseResult } from "papaparse";
import {
	LatLngBoundsExpression,
	STARTING_POS_NJ,
	STARTING_ZOOM,
	toNumberVals,
	toRemoveVals,
	TStopData,
	TStopRow,
} from "./constants";
import { Rectangle } from "./components/Rectangle";
import { getRectBounds } from "./utils";

const MapWrapper = styled.div`
	.leaflet-container {
		height: 100vh;
		width: 100vw;
	}
`;

function SetViewOnClick({
	clickPanningRef,
}: {
	clickPanningRef: React.MutableRefObject<boolean>;
}) {
	const map = useMapEvent("click", (e) => {
		map.setView(e.latlng, map.getZoom(), {
			animate: clickPanningRef.current || false,
		});
	});

	return <React.Fragment />;
}

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

const loadCSV = async (
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

// const TestFunc = (): JSX.Element => {
// 	const map = useMap();
// 	useEffect(() => {
// 		var features: any[] = [];
// 		map.eachLayer(function (layer) {
// 			if (layer instanceof L.Marker) {
// 				if (map.getBounds().contains(layer.getLatLng())) {
// 					features.push(layer);
// 				}
// 			}
// 		});
// 	}, []);
// 	return <div>Test</div>;
// };

export const Map = () => {
	const clickPanningRef = useRef(false);
	const [stopsData, setStopsData] = useState<TStopData>();

	clickPanningRef.current = true;
	useEffect(() => {
		if (!stopsData?.length) loadCSV("stops", setStopsData);
	}, []);

	return (
		<MapWrapper className="map-wrapper">
			<MapContainer center={STARTING_POS_NJ} zoom={STARTING_ZOOM}>
				{/* This is a custom hook animates map panning */}
				<SetViewOnClick clickPanningRef={clickPanningRef} />

				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				{!!stopsData?.length
					? stopsData?.slice(0, 300).map((stop: TStopRow) => {
							const rectBounds = getRectBounds(
								[stop.stop_lat, stop.stop_lon],
								"square"
							);
							return (
								<Polygon
									key={stop.stop_id}
									positions={
										rectBounds as LatLngBoundsExpression
									}
								>
									<Marker
										position={[
											stop.stop_lat,
											stop.stop_lon,
										]}
									>
										<Popup>
											{`${stop.stop_id}: ${stop.stop_name}`}
											<br />
											{`${stop.stop_lat},${stop.stop_lon}`}
										</Popup>
									</Marker>
								</Polygon>
							);
					  })
					: null}
			</MapContainer>
		</MapWrapper>
	);
};
