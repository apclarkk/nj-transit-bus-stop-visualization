import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
	IDisplayOptions,
	IOverlayProps,
	IOverlayStateProps,
	ISidebarProps,
	OverlayState,
	SidebarOptions,
	STARTING_POS_NJ,
	STARTING_ZOOM,
	TMunicipalityData,
	TStopData,
} from "./constants";
import { Map } from "./Map";
import {
	Box,
	Select,
	TextField,
	CircularProgress,
	Stack,
	FormControl,
	InputLabel,
	MenuItem,
	Button,
	Fade,
} from "@mui/material";

import { useMap, MapContainer } from "react-leaflet";
import StopsLogo from "./assets/images/stops_logo_boxed.png";

import { loadCSV } from "./utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import L from "leaflet";
import { Sidebar } from "./components/Sidebar";

const Wrapper = styled.div``;

const OverlayWrapper = styled(Box)`
	display: flex;
	align-items: center;
	position: absolute;
	width: 100%;
	height: 100%;
	background: linear-gradient(
		90deg,
		#003c5e 36.46%,
		rgba(0, 60, 94, 0.73) 63.54%,
		rgba(0, 60, 94, 0.37) 100%
	);
	margin-left: 60px;
	z-index: 1000;
	.visually-hidden {
		display: none;
		appearance: none;
	}
	#stops-logo-boxed {
		margin-left: 20px;
		max-width: 225px;
		max-height: 131px;
	}
	.overlay-inner {
		margin-left: 3em;

		.cover-copy .upper,
		.cover-copy .lower {
			display: flex;
			flex-direction: row;
		}
		.cover-copy {
			color: #fff;
			.upper {
				align-items: end;
			}
			.lower {
				align-items: center;
			}

			h2 {
				font-size: 4.8rem;
				margin: 0;
			}
			h3 {
				font-size: 1.75rem;
				font-style: italic;
				margin: 0;
			}
			p {
				font-size: 1.75rem;
				white-space: nowrap;
				margin: 0;
			}
		}
	}
	.search-wrapper,
	.select-wrapper {
		width: 250px;
	}
	.go-btn {
		color: #fff;
		border-color: initial;
	}
`;

const MapWrapper = styled.div`
	.leaflet-container {
		height: 100vh;
		width: 100vw;
	}
	.leaflet-tile {
		filter: brightness(0.7) !important;
	}
`;

export const OverlayAndMap = (): JSX.Element => {
	const [displayOptions, setDisplayOptions] = useState<IDisplayOptions>({
		boundType: "diamond",
		markerType: "marker",
		municipalityInfo: undefined,
	});
	const [overlayState, setOverlayState] = useState<IOverlayStateProps>({
		overlayState: OverlayState.HOME,
	});

	const [stopsData, setStopsData] = useState<TStopData>();
	const [municipalityData, setMunicipalityData] =
		useState<TMunicipalityData>();

	useEffect(() => {
		if (!stopsData?.length) loadCSV("stops", setStopsData);
		if (!municipalityData?.length)
			loadCSV("municipalities", setMunicipalityData).then(
				() =>
					municipalityData &&
					setDisplayOptions({
						...displayOptions,
						municipalityInfo: municipalityData[0]!,
					})
			);
	}, []);

	return (
		<Wrapper>
			<ToastContainer
				position="bottom-center"
				autoClose={3000}
				limit={2}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
			/>
			<MapWrapper className="map-wrapper">
				{/* Map container is needed here so we can use the useMap hook within the overlay */}
				<MapContainer center={STARTING_POS_NJ} zoom={STARTING_ZOOM}>
					{!!municipalityData?.length && !!stopsData?.length ? (
						<Overlay
							displayOptions={displayOptions}
							overlayState={overlayState}
							setOverlayState={setOverlayState}
							stopsData={stopsData}
							setDisplayOptions={setDisplayOptions}
							municipalityData={municipalityData.sort((a, b) =>
								a.name.localeCompare(b.name)
							)}
						/>
					) : null}
					{stopsData?.length ? (
						<Map
							stopsData={stopsData}
							overlayState={overlayState}
							displayOptions={displayOptions}
						/>
					) : (
						<Stack
							justifyContent="center"
							alignItems="center"
							height={"100vh"}
						>
							<CircularProgress />
						</Stack>
					)}
				</MapContainer>
			</MapWrapper>
		</Wrapper>
	);
};

const Overlay = ({
	displayOptions,
	setDisplayOptions,
	municipalityData,
	stopsData,
	overlayState,
	setOverlayState,
}: IOverlayProps): JSX.Element => {
	const [searchText, setSearchText] = useState<string>("");

	const onSearchChange = (event: any) => setSearchText(event.target.value);

	const map = useMap();

	const onSelectChange = (event: any) => {
		setDisplayOptions({
			...displayOptions,
			municipalityInfo: municipalityData.find(
				(e) => e.name === event.target.value
			),
		});
	};

	const onGoClick = async () => {
		// Error handling
		if (searchText && displayOptions.municipalityInfo) {
			toast.error(
				"Please clear search or select 'None' before continuing"
			);
			return;
		}
		if (!searchText && !displayOptions.municipalityInfo) {
			toast.error("Please select a municipality or search a stop");
			return;
		}
		const searchMthd = searchText || displayOptions.municipalityInfo?.name;

		// I'm adding these extra params to ensure that the selected municipality is actually located in NJ
		const searchParams = displayOptions.municipalityInfo
			? "+new+jersey+united+states"
			: "";

		const res = await fetch(
			`https://nominatim.openstreetmap.org/search?q=${searchMthd}${searchParams}&polygon_geojson=1&format=json`
		).then((res) => {
			if (res.ok) return res.json();
			else throw new Error("Error fetching data");
		});

		if (!res.length) {
			toast.error("No results found, please try again");
			return;
		}

		const { lat, lon } = res[0];

		const townBoundingLayer = new L.LayerGroup();
		const townBounding = L.geoJSON(res[0].geojson, {
			color: "blue",
			weight: 5,
			opacity: 1,
			fillOpacity: 0.0,
		} as any);
		townBoundingLayer.addTo(map);
		townBoundingLayer.addLayer(townBounding);

		setOverlayState({
			overlayState: OverlayState.MAP_SEARCHED,
			boundingLatLngs: townBounding,
		});
		// townBoundingLayer.removeLayer(townBounding);
		map.setView([lat, lon], 15);
		L.control.zoom({ position: "bottomright" }).addTo(map);
	};

	return (
		<React.Fragment>
			<Sidebar
				setOverlayState={setOverlayState}
				overlayState={overlayState}
				municipalityData={municipalityData}
				onSearchChange={onSearchChange}
				onGoClick={onGoClick}
				searchText={searchText}
				onSelectChange={onSelectChange}
				displayOptions={displayOptions}
				setDisplayOptions={setDisplayOptions}
			/>
			<Fade in={overlayState.overlayState === OverlayState.HOME}>
				<OverlayWrapper>
					<Box className="overlay-inner">
						<Box className="cover-copy">
							<div className="upper">
								<h1 className="visually-hidden">
									Welcome to Stops
								</h1>
								<Stack direction="column">
									<h2>Welcome to</h2>
									<h3>An NJ Transit bus data visualizer</h3>
								</Stack>
								<img
									src={StopsLogo}
									alt="Stops Logo"
									id="stops-logo-boxed"
								/>
							</div>
							<Stack direction="column" spacing="10px" mt={5}>
								<Stack
									className="lower"
									direction="row"
									spacing="20px"
								>
									<p>Select your town</p>
									<FormControl className="select-wrapper">
										<InputLabel id="municipality-select-label">
											Municipality
										</InputLabel>
										<Select
											labelId="municipality-select-label"
											id="municipality-select-label"
											value={
												displayOptions.municipalityInfo
													?.name ?? ""
											}
											label="Municipality"
											onChange={onSelectChange}
										>
											<MenuItem value="">None</MenuItem>
											{municipalityData.map(
												(municipality) => (
													<MenuItem
														key={
															municipality.geonamesId
														}
														value={
															municipality.name
														}
													>
														{municipality.name} /{" "}
														{municipality.county}
													</MenuItem>
												)
											)}
										</Select>
									</FormControl>
									<p style={{ marginLeft: "20px" }}>or</p>
									<TextField
										placeholder="Search"
										className="search-wrapper"
										value={searchText}
										onChange={onSearchChange}
									/>

									<Fade
										in={
											!!displayOptions.municipalityInfo
												?.name || !!searchText
										}
									>
										<Button
											variant="outlined"
											className="go-btn"
											onClick={onGoClick}
										>
											Go
										</Button>
									</Fade>
								</Stack>
								<Stack>
									<p>
										There are currently{" "}
										{stopsData.length.toLocaleString()} bus
										stops across {municipalityData.length}{" "}
										municipalities
									</p>
								</Stack>
							</Stack>
						</Box>
					</Box>
				</OverlayWrapper>
			</Fade>
		</React.Fragment>
	);
};
