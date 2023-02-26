import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";
import styled from "styled-components";
import Papa, { ParseResult } from "papaparse";
import {
	STARTING_POS_NJ,
	STARTING_ZOOM,
	toNumberVals,
	toRemoveVals,
	TStopData,
	TStopRow,
} from "./constants";
import { CustomMarker } from "./components/CustomMarker";

const MapWrapper = styled.div`
	.leaflet-container {
		height: 100vh;
		width: 100vw;
	}
	.leaflet-tile {
		filter: brightness(0.7) !important;
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
					? stopsData
							.slice(0, 1000) // uncomment to remove limit of markers... at your own peril
							.map((stop: TStopRow) => <CustomMarker {...stop} />)
					: null}
			</MapContainer>
		</MapWrapper>
	);
};
