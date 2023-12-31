import { Box, Button, TextField } from "@mui/material";
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

import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";

//icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// context
import { useAdminDataContext } from "../../hooks/useAdminDataContext";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { adminData, dispatch } = useAdminDataContext();

  const [editBtnDisabled, setEditBtnDisabled] = useState(true);
  const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const response = await fetch("/api/adminData"); //4000 is the port that server is listening to

      const json = await response.json(); //parsed into an array of objects

      //check if response if ok (data get back successfully)
      if (response.ok) {
        dispatch({ type: "SET_ADMINS", payload: json });
      }
    };

    fetchAdmins();
  }, [dispatch]); //only fires once when the Admin page first renders

  //try to add the new admin to db
  const handleFormSubmit = async (values, { resetForm }) => {
    //make an admin object
    const admin = {
      name: values.name,
      username: values.username,
      password: values.password,
      phoneNumber: values.phoneNumber,
      email: values.email,
    };

    const response = await fetch("/api/adminData", {
      method: "POST",
      body: JSON.stringify(admin), //changes the object into a json string
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

      alert("New admin added.");
      dispatch({ type: "CREATE_ADMIN", payload: json });
    }
  };

  //try to edit the selected admin in db
  const handleEditFormSubmit = async (values, { resetForm }) => {
    //make an admin object
    const admin = {
      name: values.name,
      phoneNumber: values.phoneNumber,
      email: values.email,
    };
    const response = await fetch("/api/adminData/" + edit._id, {
      method: "PATCH",
      body: JSON.stringify(admin), //changes the object into a json string
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
      alert("Admin details edited successfully.");
      dispatch({ type: "EDIT_ADMIN", payload: json });
    }
  };

  const handleDeleteAdmin = async () => {
    setDeleteDialogOpen(false);

    //make an object
    const toBeDeleted = { ids: rowSelectionModel }; //deletes is an (string) array of to be deleted admin ids

    const response = await fetch("/api/adminData/" + rowSelectionModel[0], {
      method: "DELETE",
      body: JSON.stringify(toBeDeleted), //changes the object into a json string
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (response.ok) {
      //clear state
      setRowSelectionModel([]);
      setEditBtnDisabled(true);
      setDeleteBtnDisabled(true);

      alert("Admin(s) deleted successfully.");
      dispatch({ type: "DELETE_ADMIN", payload: json });
    }
  };

  const columns = [
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
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
  ];

  function CustomToolbar() {
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
      <Header title="ADMINS" subtitle="List of Admins" />
      {adminData && (
        <Box
          m="40px 0 0 0"
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
            rows={adminData}
            columns={columns}
            getRowId={(row) => row._id}
            slots={{ toolbar: CustomToolbar }}
            onRowSelectionModelChange={(id) => {
              const selectedIDs = new Set(id);
              setRowSelectionModel(id);

              //check if more than 1 row is selected
              if (selectedIDs.size === 0) {
                setEditBtnDisabled(true);
                setDeleteBtnDisabled(true);
              } else if (selectedIDs.size === 1) {
                const selectedRowData = adminData.filter((row) =>
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

      {/* enroll admin form */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: 60 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AdminPanelSettingsIcon
            style={{ height: 35, width: 35, marginRight: 12 }}
          />
          <h1 style={{ fontFamily: "Quicksand", fontSize: 27 }}>
            Enroll New Admin
          </h1>
        </div>

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
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
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={!!touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Phone Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phoneNumber}
                  name="phoneNumber"
                  error={!!touched.phoneNumber && !!errors.phoneNumber}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="end"
                mt="20px"
                marginBottom={10}
              >
                <Button type="submit" color="secondary" variant="contained">
                  Create New Admin User
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </div>

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
              Edit Admin Details
            </h1>
            {edit && (
              <Formik
                initialValues={{
                  name: edit.name,
                  email: edit.email,
                  phoneNumber: edit.phoneNumber,
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
                        variant="filled"
                        type="text"
                        label="Name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        name="name"
                        error={!!touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                        sx={{ gridColumn: "span 4" }}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        name="email"
                        error={!!touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                        sx={{ gridColumn: "span 4" }}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Phone Number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.phoneNumber}
                        name="phoneNumber"
                        error={!!touched.phoneNumber && !!errors.phoneNumber}
                        helperText={touched.phoneNumber && errors.phoneNumber}
                        sx={{ gridColumn: "span 4" }}
                      />
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
            Are you sure you want to delete the selected admin(s) from the
            database?
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
          <Button onClick={handleDeleteAdmin}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const nameRegExp = /^[a-zA-Z\s]*$/;

const passwordRegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/;

const checkoutSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required.")
    .matches(nameRegExp, "Name should only contain letters."),
  email: yup
    .string()
    .email("Invalid email address.")
    .required("Email is required."),
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "Invalid phone number.")
    .required("Phone number is required."),
  username: yup.string().required("Username is required."),
  password: yup
    .string()
    .required("Password is required.")
    .matches(
      passwordRegExp,
      "Password must be at least 8 characters long and should include a combination of uppercase and lowercase letters, numbers, and special characters."
    ),
});

const editCheckoutSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required.")
    .matches(nameRegExp, "Name should only contain letters."),
  email: yup
    .string()
    .email("Invalid email address.")
    .required("Email is required."),
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "Invalid phone number.")
    .required("Phone number is required."),
});

const initialValues = {
  name: "",
  username: "",
  password: "",
  email: "",
  phoneNumber: "",
};

export default Contacts;
