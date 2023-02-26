import React, { useEffect } from "react";

import { TMunicipalityData, TStopData } from "../constants";

import { DataGrid } from "@mui/x-data-grid";
import { Switch, FormGroup, FormControlLabel } from "@mui/material";

interface ITransitDataTableProps {
	municipalityData: TMunicipalityData | undefined;
	stopData: TStopData | undefined;
}

export const TransitDataTable = ({
	municipalityData,
	stopData,
}: ITransitDataTableProps): JSX.Element => {
	// const [useCleanedData, setUseCleanedData] = React.useState(false);
	const [activeDataTable, setActiveDataTable] = React.useState<
		"stops" | "municipalities"
	>("stops");

	const [columns, setColumns] = React.useState<any[]>([]);

	useEffect(() => {
		const activeData =
			activeDataTable === "stops" ? stopData : municipalityData;
		setColumns(
			Object.keys(activeData?.[0] || {}).map((key) => ({
				field: key,
				headerName: key,
				width: 150,
			}))
		);
	}, [activeDataTable, municipalityData, stopData]);

	return (
		<div style={{ height: 400, width: "100%" }}>
			<FormGroup>
				{/* <FormControlLabel
					control={
						<Switch
							defaultChecked={useCleanedData}
							onClick={() => setUseCleanedData((prev) => !prev)}
						/>
					}
					label="Show cleaned data"
				/> */}
				<FormControlLabel
					control={
						<Switch
							defaultChecked={activeDataTable === "stops"}
							onClick={() =>
								setActiveDataTable((prev) =>
									prev === "municipalities"
										? "stops"
										: "municipalities"
								)
							}
						/>
					}
					label="Municipalities | Stops"
				/>
			</FormGroup>
			<DataGrid
				rows={(activeDataTable === "stops"
					? stopData!
					: (municipalityData as any[])
				).map((row, i) => ({
					id: i,
					...row,
				}))}
				columns={columns}
				pageSize={100}
				rowsPerPageOptions={[100]}
			/>
		</div>
	);
};
