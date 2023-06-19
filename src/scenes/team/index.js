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

import MenuItem from "@mui/material/MenuItem";

import moment from "moment";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";

//icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// context
import { useStudentDataContext } from "../../hooks/useStudentDataContext";
import { useAdminAuthContext } from "../../hooks/useAdminAuthContext";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { studentData, dispatch } = useStudentDataContext();
  const { adminUser } = useAdminAuthContext();

  const [editBtnDisabled, setEditBtnDisabled] = useState(true);
  const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch("/api/studentData", {
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
        },
      }); //4000 is the port that server is listening to

      const json = await response.json(); //parsed into an array of objects

      //check if response if ok (data get back successfully)
      if (response.ok) {
        dispatch({ type: "SET_STUDENTS", payload: json });
      }
    };

    fetchStudents();
  }, [dispatch]); //only fires once when the Student page first renders

  //try to add the new student to db
  const handleFormSubmit = async (values, { resetForm }) => {
    //make an student object
    const student = {
      name: values.name,
      username: values.username,
      password: values.password,
      email: values.email,
      phoneNumber: values.phoneNumber,
      gender: values.gender,
      birthday: moment(values.birthday.toString()).format("MM/DD/YYYY"),
      school: values.school,
    };

    const response = await fetch("/api/studentData", {
      method: "POST",
      body: JSON.stringify(student), //changes the object into a json string
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminUser.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      alert(json.error);
    }

    if (response.ok) {
      //clear form
      resetForm();

      alert("New student added.");
      dispatch({ type: "CREATE_STUDENT", payload: json });
    }
  };

  //try to edit the selected student in db
  const handleEditFormSubmit = async (values, { resetForm }) => {
    //make an student object
    const student = {
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
      gender: values.gender,
      birthday: moment(values.birthday.toString()).format("MM/DD/YYYY"),
      school: values.school,
      violateNum: values.violateNum,
      blacklistNum: values.blacklistNum,
      authStat: values.authStat,
    };

    const response = await fetch("/api/studentData/" + edit._id, {
      method: "PATCH",
      body: JSON.stringify(student), //changes the object into a json string
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminUser.token}`,
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

      alert("Student details edited successfully.");
      dispatch({ type: "EDIT_STUDENT", payload: json });
    }
  };

  const handleDeleteStudent = async () => {
    setDeleteDialogOpen(false);

    //make an object
    const toBeDeleted = { ids: rowSelectionModel }; //deletes is an (string) array of to be deleted student ids

    const response = await fetch("/api/studentData/" + rowSelectionModel[0], {
      method: "DELETE",
      body: JSON.stringify(toBeDeleted), //changes the object into a json string
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminUser.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      //clear state
      setRowSelectionModel([]);
      setEditBtnDisabled(true);
      setDeleteBtnDisabled(true);

      alert("Student(s) deleted successfully.");
      dispatch({ type: "DELETE_STUDENT", payload: json });
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
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
    },
    {
      field: "birthday",
      headerName: "Birthday",
      flex: 1,
    },
    {
      field: "school",
      headerName: "School",
      flex: 1,
    },
    {
      field: "reserveNum",
      headerName: "No. of Reservations",
      flex: 0.5,
    },
    {
      field: "violateNum",
      headerName: "No. of Violations",
      flex: 0.5,
    },
    {
      field: "blacklistNum",
      headerName: "No. of Blacklists",
      flex: 0.5,
    },
    {
      field: "authStat",
      headerName: "Auth State",
      flex: 1,
    },
    {
      field: "seatStat",
      headerName: "Seat State",
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
      <Header title="STUDENTS" subtitle="List of Students" />
      {studentData && (
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
            rows={studentData}
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
                const selectedRowData = studentData.filter((row) =>
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

      {/* enroll student form */}
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
            Enroll New Student
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
            setFieldValue,
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

                <TextField
                  fullWidth
                  select
                  variant="filled"
                  type="text"
                  label="Gender"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.gender}
                  name="gender"
                  error={!!touched.gender && !!errors.gender}
                  helperText={touched.gender && errors.gender}
                  sx={{ gridColumn: "span 2" }}
                >
                  <MenuItem value={"Female"}>Female</MenuItem>
                  <MenuItem value={"Male"}>Male</MenuItem>
                  <MenuItem value={"Transgender Female"}>
                    Transgender Female
                  </MenuItem>
                  <MenuItem value={"Transgender Male"}>
                    Transgender Male
                  </MenuItem>
                  <MenuItem value={"Gender Variant/Non-Conforming"}>
                    Gender Variant/Non-Conforming
                  </MenuItem>
                  <MenuItem value={"Prefer Not to Say"}>
                    Prefer Not to Say
                  </MenuItem>
                </TextField>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Birthday"
                    id="birthday"
                    name="birthday"
                    views={["day", "month", "year"]}
                    disableFuture
                    inputFormat="MM/DD/YYYY"
                    value={values.birthday}
                    onChange={(value) => {
                      setFieldValue("birthday", value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="filled"
                        type="date"
                        label="Birthday"
                        onBlur={handleBlur}
                        name="birthday"
                        error={!!touched.birthday && !!errors.birthday}
                        helperText={touched.birthday && errors.birthday}
                        sx={{ gridColumn: "span 2" }}
                        inputProps={{
                          ...params.inputProps,
                          placeholder: "MM/DD/YYYY",
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  fullWidth
                  select
                  variant="filled"
                  type="text"
                  label="School"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.school}
                  name="school"
                  error={!!touched.school && !!errors.school}
                  helperText={touched.school && errors.school}
                  sx={{ gridColumn: "span 4" }}
                >
                  <MenuItem value={"BACFIN"}>
                    BACFIN - Bachelor of Arts (Hons) Accounting and Finance 3+0
                    in Collaboration with University of Hertfordshire, UK
                  </MenuItem>
                  <MenuItem value={"BBDUH"}>
                    BBDUH - Bachelor of Arts (Hons) Business Administration 3+0
                    in Collaboration with University of Hertfordshire, UK
                  </MenuItem>
                  <MenuItem value={"BBSUT"}>
                    BBSUT - Bachelor of Business 3+0 in Collaboration with
                    Swinburne University of Technology, Australia
                  </MenuItem>
                  <MenuItem value={"BCSCU"}>
                    BCSCU - Bachelor of Science (Hons) in Computer Science 3+0
                    in Collaboration with Coventry University, UK
                  </MenuItem>
                  <MenuItem value={"BCTCU"}>
                    BCTCU - Bachelor of Science (Hons) in Computing 3+0 in
                    Collaboration with Coventry University, UK
                  </MenuItem>
                  <MenuItem value={"BEECU"}>
                    BEECU - Bachelor of Engineering (Hons) in Electrical and
                    Electronics Engineering 3+0 in Collaboration with Coventry
                    University, UK
                  </MenuItem>
                  <MenuItem value={"BMCUH"}>
                    BMCUH - Bachelor of Arts (Hons) Mass Communications 3+0 in
                    Collaboration with University of Hertfordshire, UK
                  </MenuItem>
                  <MenuItem value={"BMECU"}>
                    BMECU - Bachelor of Engineering (Hons) in Mechanical
                    Engineering 3+0 in Collaboration with Coventry University,
                    UK
                  </MenuItem>
                </TextField>
              </Box>
              <Box
                display="flex"
                justifyContent="end"
                mt="20px"
                marginBottom={10}
              >
                <Button type="submit" color="secondary" variant="contained">
                  Create New Student User
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
              Edit Student Details
            </h1>
            {edit && (
              <Formik
                initialValues={{
                  name: edit.name,
                  email: edit.email,
                  phoneNumber: edit.phoneNumber,
                  gender: edit.gender,
                  birthday: dayjs(edit.birthday),
                  school: edit.school,
                  violateNum: edit.violateNum,
                  blacklistNum: edit.blacklistNum,
                  authStat: edit.authStat,
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
                  setFieldValue,
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

                      <TextField
                        fullWidth
                        select
                        variant="filled"
                        type="text"
                        label="Gender"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.gender}
                        name="gender"
                        error={!!touched.gender && !!errors.gender}
                        helperText={touched.gender && errors.gender}
                        sx={{ gridColumn: "span 2" }}
                      >
                        <MenuItem value={"Female"}>Female</MenuItem>
                        <MenuItem value={"Male"}>Male</MenuItem>
                        <MenuItem value={"Transgender Female"}>
                          Transgender Female
                        </MenuItem>
                        <MenuItem value={"Transgender Male"}>
                          Transgender Male
                        </MenuItem>
                        <MenuItem value={"Gender Variant/Non-Conforming"}>
                          Gender Variant/Non-Conforming
                        </MenuItem>
                        <MenuItem value={"Prefer Not to Say"}>
                          Prefer Not to Say
                        </MenuItem>
                      </TextField>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Birthday"
                          id="birthday"
                          name="birthday"
                          views={["day", "month", "year"]}
                          disableFuture
                          inputFormat="MM/DD/YYYY"
                          value={values.birthday}
                          onChange={(value) => {
                            setFieldValue("birthday", value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              variant="filled"
                              type="date"
                              label="Birthday"
                              onBlur={handleBlur}
                              name="birthday"
                              error={!!touched.birthday && !!errors.birthday}
                              helperText={touched.birthday && errors.birthday}
                              sx={{ gridColumn: "span 2" }}
                              inputProps={{
                                ...params.inputProps,
                                placeholder: "MM/DD/YYYY",
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                      <TextField
                        fullWidth
                        select
                        variant="filled"
                        type="text"
                        label="School"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.school}
                        name="school"
                        error={!!touched.school && !!errors.school}
                        helperText={touched.school && errors.school}
                        sx={{ gridColumn: "span 4" }}
                      >
                        <MenuItem value={"BACFIN"}>
                          BACFIN - Bachelor of Arts (Hons) Accounting and
                          Finance 3+0 in Collaboration with University of
                          Hertfordshire, UK
                        </MenuItem>
                        <MenuItem value={"BBDUH"}>
                          BBDUH - Bachelor of Arts (Hons) Business
                          Administration 3+0 in Collaboration with University of
                          Hertfordshire, UK
                        </MenuItem>
                        <MenuItem value={"BBSUT"}>
                          BBSUT - Bachelor of Business 3+0 in Collaboration with
                          Swinburne University of Technology, Australia
                        </MenuItem>
                        <MenuItem value={"BCSCU"}>
                          BCSCU - Bachelor of Science (Hons) in Computer Science
                          3+0 in Collaboration with Coventry University, UK
                        </MenuItem>
                        <MenuItem value={"BCTCU"}>
                          BCTCU - Bachelor of Science (Hons) in Computing 3+0 in
                          Collaboration with Coventry University, UK
                        </MenuItem>
                        <MenuItem value={"BEECU"}>
                          BEECU - Bachelor of Engineering (Hons) in Electrical
                          and Electronics Engineering 3+0 in Collaboration with
                          Coventry University, UK
                        </MenuItem>
                        <MenuItem value={"BMCUH"}>
                          BMCUH - Bachelor of Arts (Hons) Mass Communications
                          3+0 in Collaboration with University of Hertfordshire,
                          UK
                        </MenuItem>
                        <MenuItem value={"BMECU"}>
                          BMECU - Bachelor of Engineering (Hons) in Mechanical
                          Engineering 3+0 in Collaboration with Coventry
                          University, UK
                        </MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="number"
                        inputProps={{ min: 0 }}
                        label="No. of Violations"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.violateNum}
                        name="violateNum"
                        error={!!touched.violateNum && !!errors.violateNum}
                        helperText={touched.violateNum && errors.violateNum}
                        sx={{ gridColumn: "span 2" }}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="number"
                        inputProps={{ min: 0 }}
                        label="No. of Blacklists"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.blacklistNum}
                        name="blacklistNum"
                        error={!!touched.blacklistNum && !!errors.blacklistNum}
                        helperText={touched.blacklistNum && errors.blacklistNum}
                        sx={{ gridColumn: "span 2" }}
                      />
                      <TextField
                        fullWidth
                        select
                        variant="filled"
                        type="text"
                        label="Auth State"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.authStat}
                        name="authStat"
                        error={!!touched.authStat && !!errors.authStat}
                        helperText={touched.authStat && errors.authStat}
                        sx={{ gridColumn: "span 4" }}
                      >
                        <MenuItem value={"Authorized"}>Authorized</MenuItem>
                        <MenuItem value={"Blacklisted"}>Blacklisted</MenuItem>
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
            Are you sure you want to delete the selected student(s) from the
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
          <Button onClick={handleDeleteStudent}>OK</Button>
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
  gender: yup.string().required("Gender is required."),
  birthday: yup
    .date()
    .typeError("Invalid date.")
    .max(new Date(), "DOB cannot be greater than today's date.")
    .required("Birthday is required."),
  school: yup.string().required("School is required."),
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
  gender: yup.string().required("Gender is required."),
  birthday: yup
    .date()
    .typeError("Invalid date.")
    .max(new Date(), "DOB cannot be greater than today's date.")
    .required("Birthday is required."),
  school: yup.string().required("School is required."),
  violateNum: yup
    .number()
    .typeError("Invalid violation number.")
    .min(0, "No. of violations cannot be less than 0.")
    .required("No. of violations is required."),
  blacklistNum: yup
    .number()
    .typeError("Invalid blacklist number.")
    .min(0, "No. of blacklists cannot be less than 0.")
    .required("No. of blacklists is required."),
  authStat: yup.string().required("Auth state is required."),
});

const initialValues = {
  name: "",
  username: "",
  password: "",
  email: "",
  phoneNumber: "",
  gender: "",
  birthday: null,
  school: "",
};

export default Team;
