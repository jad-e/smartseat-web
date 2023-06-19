import { Box, Typography, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

import MenuItem from "@mui/material/MenuItem";

import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";

//icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

//context
//reservation context
import { useReservationContext } from "../../hooks/useReservationContext";
//violation records context
import { useViolationContext } from "../../hooks/useViolationContext";
//assistance records context
import { useAssistanceRequestContext } from "../../hooks/useAssistanceRequestContext";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { reservation, dispatchR } = useReservationContext();
  const { violation, dispatchV } = useViolationContext();
  const { assistanceRequest, dispatchA } = useAssistanceRequestContext();

  const [editBtnDisabled, setEditBtnDisabled] = useState(true);
  const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const response = await fetch("/api/reservation"); //4000 is the port that server is listening to

      const json = await response.json(); //parsed into an array of objects

      //check if response if ok (data get back successfully)
      if (response.ok) {
        dispatchR({ type: "SET_RESERVATIONS", payload: json });
      }
    };

    const fetchViolations = async () => {
      const response = await fetch("/api/violation"); //4000 is the port that server is listening to

      const json = await response.json(); //parsed into an array of objects

      //check if response if ok (data get back successfully)
      if (response.ok) {
        dispatchV({ type: "SET_VIOLATIONS", payload: json });
      }
    };

    const fetchAssistanceRequests = async () => {
      const response = await fetch("/api/assistanceRequest"); //4000 is the port that server is listening to

      const json = await response.json(); //parsed into an array of objects

      //check if response if ok (data get back successfully)
      if (response.ok) {
        dispatchA({ type: "SET_ASSISTANCEREQUESTS", payload: json });
      }
    };

    fetchReservations();
    fetchViolations();
    fetchAssistanceRequests();
  }, [dispatchR, dispatchV, dispatchA]); //only fires once when the Other Data page first renders

  //try to edit the selected assistance request in db
  const handleEditFormSubmit = async (values, { resetForm }) => {
    //make an assistanceRequest object
    const assistanceRequest = {
      status: values.status,
    };

    const response = await fetch("/api/assistanceRequest/" + edit._id, {
      method: "PATCH",
      body: JSON.stringify(assistanceRequest), //changes the object into a json string
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      alert(json.error);
    }

    if (response.ok) {
      //clear form
      resetForm();

      //clear state
      setEdit(null);
      setRowSelectionModel([]);
      setEditBtnDisabled(true);
      setDeleteBtnDisabled(true);

      alert("Assistance request status edited successfully.");
      dispatchA({ type: "EDIT_ASSISTANCEREQUEST", payload: json });
    }
  };

  const handleDeleteAssistanceRequest = async () => {
    setDeleteDialogOpen(false);

    //make an object
    const toBeDeleted = { ids: rowSelectionModel }; //deletes is an (string) array of to be deleted assistance request ids

    const response = await fetch(
      "/api/assistanceRequest/" + rowSelectionModel[0],
      {
        method: "DELETE",
        body: JSON.stringify(toBeDeleted), //changes the object into a json string
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      //clear state
      setRowSelectionModel([]);
      setEditBtnDisabled(true);
      setDeleteBtnDisabled(true);

      alert("Assistance request(s) deleted successfully.");
      dispatchA({ type: "DELETE_ASSISTANCEREQUEST", payload: json });
    }
  };

  const columnsR = [
    {
      field: "_id",
      filterable: false,
      editable: false,
      headerName: "Number",
      renderCell: (index) =>
        index.api.getRowIndexRelativeToVisibleRows(index.row._id) + 1,
      flex: 0.5,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "timeStart",
      headerName: "Time Start",
      flex: 1,
    },
    {
      field: "timeEnd",
      headerName: "Time End",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "venue",
      headerName: "Venue",
      flex: 1,
    },
    {
      field: "seat",
      headerName: "Seat",
      flex: 1,
    },
  ];

  const columnsV = [
    {
      field: "_id",
      filterable: false,
      editable: false,
      headerName: "Number",
      renderCell: (index) =>
        index.api.getRowIndexRelativeToVisibleRows(index.row._id) + 1,
      flex: 0.5,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "violationType",
      headerName: "Violation Type",
      flex: 1,
    },
    {
      field: "dateTime",
      headerName: "Date & Time",
      flex: 1,
    },
  ];

  const columnsA = [
    {
      field: "_id",
      filterable: false,
      editable: false,
      headerName: "Number",
      renderCell: (index) =>
        index.api.getRowIndexRelativeToVisibleRows(index.row._id) + 1,
      flex: 0.5,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "seatNumber",
      headerName: "Seat Number",
      flex: 1,
    },
    {
      field: "dateTime",
      headerName: "Date & Time",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
  ];

  function CustomToolbarR() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  function CustomToolbarV() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  function CustomToolbarA() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => {
            setEditDialogOpen(true);
          }}
          disabled={editBtnDisabled}
        >
          EDIT
        </Button>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => {
            setDeleteDialogOpen(true);
          }}
          disabled={deleteBtnDisabled}
        >
          DELETE
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <Box m="20px">
      <Header
        title="OTHER DATA"
        subtitle="Seat Reservation Records, Violation Records, and More"
      />

      <Typography
        variant="h3"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "80px 0 0 0" }}
      >
        Reservations
      </Typography>
      {reservation && (
        <Box
          m="15px 0 0 0"
          height="45vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            rows={reservation}
            columns={columnsR}
            getRowId={(row) => row._id}
            slots={{ toolbar: CustomToolbarR }}
          />
        </Box>
      )}

      <Typography
        variant="h3"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "80px 0 0 0" }}
      >
        Violations
      </Typography>

      {violation && (
        <Box
          m="15px 0 0 0"
          height="45vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            rows={violation}
            columns={columnsV}
            getRowId={(row) => row._id}
            slots={{ toolbar: CustomToolbarV }}
          />
        </Box>
      )}

      <Typography
        variant="h3"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "80px 0 0 0" }}
      >
        Assistance Requests
      </Typography>

      {assistanceRequest && (
        <Box
          m="15px 0 0 0"
          height="45vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            checkboxSelection
            rows={assistanceRequest}
            columns={columnsA}
            getRowId={(row) => row._id}
            slots={{ toolbar: CustomToolbarA }}
            onRowSelectionModelChange={(id) => {
              const selectedIDs = new Set(id);
              setRowSelectionModel(id);

              //check if more than 1 row is selected
              if (selectedIDs.size === 0) {
                setEditBtnDisabled(true);
                setDeleteBtnDisabled(true);
              } else if (selectedIDs.size === 1) {
                const selectedRowData = assistanceRequest.filter((row) =>
                  selectedIDs.has(row._id)
                );

                setEdit(selectedRowData[0]);

                setEditBtnDisabled(false);
                setDeleteBtnDisabled(false);
              } else {
                //more than 1 row selected

                setEditBtnDisabled(true);
                setDeleteBtnDisabled(false);
              }
            }}
            rowSelectionModel={rowSelectionModel}
          />
        </Box>
      )}

      <div style={{ height: 50 }}></div>

      {/* Dialogs */}

      <Dialog
        fullWidth
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
        }}
      >
        <DialogContent>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1
              style={{
                alignSelf: "center",
                fontFamily: "Quicksand",
                fontSize: 27,
              }}
            >
              Edit Assistance Request Status
            </h1>
            {edit && (
              <Formik
                initialValues={{
                  status: edit.status,
                }}
                onSubmit={handleEditFormSubmit}
                validationSchema={editCheckoutSchema}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Box
                      display="grid"
                      gap="30px"
                      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                      sx={{
                        "& > div": {
                          gridColumn: isNonMobile ? undefined : "span 4",
                        },
                      }}
                    >
                      <TextField
                        fullWidth
                        select
                        variant="filled"
                        type="text"
                        label="Status"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.status}
                        name="status"
                        error={!!touched.status && !!errors.status}
                        helperText={touched.status && errors.status}
                        sx={{ gridColumn: "span 4" }}
                      >
                        <MenuItem value={"Done"}>Done</MenuItem>
                        <MenuItem value={"Not Done"}>Not Done</MenuItem>
                      </TextField>
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px">
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        onClick={() => {
                          setEditDialogOpen(false);
                        }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the selected assistance request(s)
            from the database?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              //do something
              setDeleteDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteAssistanceRequest}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const editCheckoutSchema = yup.object().shape({
  status: yup.string().required("Status is required."),
});

export default Invoices;
