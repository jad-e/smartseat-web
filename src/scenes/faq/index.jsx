import { Box, Button, TextField, useTheme, Typography } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";

import { Formik } from "formik";
import * as yup from "yup";

import moment from "moment";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import Switch from "@mui/material/Switch";
import { alpha, styled } from "@mui/material/styles";

//icons
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

// context
import { useCustomizationContext } from "../../hooks/useCustomizationContext";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { customization, dispatch } = useCustomizationContext();

  //states
  const [edit, setEdit] = useState(true); //originally null
  const [changeMade, setChangeMade] = useState(false);

  useEffect(() => {
    const fetchCustomizations = async () => {
      const response = await fetch("/api/customization"); //4000 is the port that server is listening to

      const json = await response.json(); //parsed into an array of objects

      //check if response if ok (data get back successfully)
      if (response.ok) {
        dispatch({ type: "SET_CUSTOMIZATIONS", payload: json });
      }
    };

    fetchCustomizations();
  }, [dispatch]); //only fires once when the Student page first renders

  const ColorSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: colors.blueAccent[700],
      "&:hover": {
        backgroundColor: alpha(
          colors.blueAccent[700],
          theme.palette.action.hoverOpacity
        ),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: colors.grey[100],
    },
  }));

  const SaveButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(colors.blueAccent[700]),
    backgroundColor: colors.blueAccent[700],
    "&:hover": {
      backgroundColor: colors.blueAccent[700],
    },
  }));

  //try to edit the selected customization in db
  const handleEditFormSubmit = async (values) => {
    //make an student object

    const customization = {
      revCheckInTimeLimit: values.revCheckInTimeLimit,

      shortBreakTimeLimit: values.shortBreakTimeLimit,
      shortBreakUsageAmount: values.shortBreakUsageAmount,

      lunchBreakTimeLimit: values.lunchBreakTimeLimit,
      lunchBreakStartTime: values.lunchBreakStartTime,
      lunchBreakEndTime: values.lunchBreakEndTime,
      lunchBreakUsageAmount: values.lunchBreakUsageAmount,

      dinnerBreakTimeLimit: values.dinnerBreakTimeLimit,
      dinnerBreakStartTime: values.dinnerBreakStartTime,
      dinnerBreakEndTime: values.dinnerBreakEndTime,
      dinnerBreakUsageAmount: values.dinnerBreakUsageAmount,

      reservationDisabled: values.reservationDisabled,
    };

    const response = await fetch("/api/customization/" + edit._id, {
      method: "PATCH",
      body: JSON.stringify(customization), //changes the object into a json string
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      alert(json.error);
    }

    if (response.ok) {
      //clear state
      setEdit(null);

      alert("Changes applied succesfully.");
      dispatch({ type: "EDIT_CUSTOMIZATION", payload: json });
    }
  };

  return (
    <Box m="20px">
      <Header
        title="CUSTOMIZATIONS"
        subtitle="Customize Different Types of System Options and Settings"
      />

      <div style={{ height: 20 }}></div>

      {/* editable form */}

      {edit && (
        <Formik
          initialValues={{
            revCheckInTimeLimit: edit.revCheckInTimeLimit,
            shortBreakTimeLimit: edit.shortBreakTimeLimit,
            shortBreakUsageAmount: edit.shortBreakUsageAmount,
            lunchBreakTimeLimit: edit.lunchBreakTimeLimit,
            lunchBreakStartTime: edit.lunchBreakStartTime,
            lunchBreakUsageAmount: edit.lunchBreakUsageAmount,
            dinnerBreakTimeLimit: edit.dinnerBreakTimeLimit,
            dinnerBreakStartTime: edit.dinnerBreakStartTime,
            dinnerBreakUsageAmount: edit.dinnerBreakUsageAmount,
            reservationDisabled: edit.reservationDisabled,
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* reservation*/}
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "40%",
                      paddingRight: 50,
                    }}
                  >
                    <Typography
                      variant="h4"
                      color={colors.grey[100]}
                      fontWeight="bold"
                      sx={{ m: "0 0 5px 0" }}
                    >
                      Reservation
                    </Typography>
                    <Typography variant="h6">
                      Customize the time limit for students to check-in to their
                      reserved seats. You can modify this during library closing
                      and/or maintenance hours.
                    </Typography>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "60%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "60%",
                        paddingRight: 50,
                      }}
                    >
                      <Typography
                        variant="h5"
                        color={colors.grey[100]}
                        fontWeight="bold"
                        sx={{ m: "0 0 5px 0" }}
                      >
                        Check-In Time Limit
                      </Typography>
                      <Typography variant="h6">
                        The time limit for students to check-in to their
                        reserved seats.
                      </Typography>
                    </div>

                    <div
                      style={{
                        width: "40%",
                      }}
                    >
                      <TextField
                        fullWidth
                        variant="filled"
                        type="number"
                        inputProps={{ min: 0 }}
                        label="Minute(s)"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.revCheckInTimeLimit}
                        name="revCheckInTimeLimit"
                        error={
                          !!touched.revCheckInTimeLimit &&
                          !!errors.revCheckInTimeLimit
                        }
                        helperText={
                          touched.revCheckInTimeLimit &&
                          errors.revCheckInTimeLimit
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* DIVIDER */}
                <div
                  style={{
                    backgroundColor: "#C0C0C0",
                    width: "100%",
                    height: 1,
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                />

                {/* break*/}
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "40%",
                      paddingRight: 50,
                    }}
                  >
                    <Typography
                      variant="h4"
                      color={colors.grey[100]}
                      fontWeight="bold"
                      sx={{ m: "0 0 5px 0" }}
                    >
                      Break
                    </Typography>
                    <Typography variant="h6">
                      Customize the starting time, time limit, and usage amount
                      for all types of break options. You can modify this during
                      library closing and/or maintenance hours.
                    </Typography>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "60%",
                    }}
                  >
                    {/* SECTION SHORT BREAK */}
                    <Typography
                      variant="h4"
                      color={colors.grey[100]}
                      fontWeight="bold"
                      sx={{ m: "0 0 20px 0" }}
                    >
                      Short Break
                    </Typography>

                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "60%",
                          paddingRight: 50,
                        }}
                      >
                        <Typography
                          variant="h5"
                          color={colors.grey[100]}
                          fontWeight="bold"
                          sx={{ m: "0 0 5px 0" }}
                        >
                          Time Limit
                        </Typography>
                        <Typography variant="h6">
                          The time limit for students to return to their seats
                          after taking a short break.
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "40%",
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          type="number"
                          inputProps={{ min: 0 }}
                          label="Minute(s)"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.shortBreakTimeLimit}
                          name="shortBreakTimeLimit"
                          error={
                            !!touched.shortBreakTimeLimit &&
                            !!errors.shortBreakTimeLimit
                          }
                          helperText={
                            touched.shortBreakTimeLimit &&
                            errors.shortBreakTimeLimit
                          }
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 20,
                        marginBottom: 40,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "60%",
                          paddingRight: 50,
                        }}
                      >
                        <Typography
                          variant="h5"
                          color={colors.grey[100]}
                          fontWeight="bold"
                          sx={{ m: "0 0 5px 0" }}
                        >
                          Usage Amount
                        </Typography>
                        <Typography variant="h6">
                          The number of times the short break option can be used
                          during a seat reservation period.
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "40%",
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          type="number"
                          inputProps={{ min: 0 }}
                          label="Minute(s)"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.shortBreakUsageAmount}
                          name="shortBreakUsageAmount"
                          error={
                            !!touched.shortBreakUsageAmount &&
                            !!errors.shortBreakUsageAmount
                          }
                          helperText={
                            touched.shortBreakUsageAmount &&
                            errors.shortBreakUsageAmount
                          }
                        />
                      </div>
                    </div>

                    <Typography
                      variant="h4"
                      color={colors.grey[100]}
                      fontWeight="bold"
                      sx={{ m: "0 0 20px 0" }}
                    >
                      Lunch Break
                    </Typography>

                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "60%",
                          paddingRight: 50,
                        }}
                      >
                        <Typography
                          variant="h5"
                          color={colors.grey[100]}
                          fontWeight="bold"
                          sx={{ m: "0 0 5px 0" }}
                        >
                          Time Limit
                        </Typography>
                        <Typography variant="h6">
                          The time limit for students to return to their seats
                          after taking a lunch break.
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "40%",
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          type="number"
                          inputProps={{ min: 0 }}
                          label="Minute(s)"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.lunchBreakTimeLimit}
                          name="lunchBreakTimeLimit"
                          error={
                            !!touched.lunchBreakTimeLimit &&
                            !!errors.lunchBreakTimeLimit
                          }
                          helperText={
                            touched.lunchBreakTimeLimit &&
                            errors.lunchBreakTimeLimit
                          }
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 20,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "60%",
                          paddingRight: 50,
                        }}
                      >
                        <Typography
                          variant="h5"
                          color={colors.grey[100]}
                          fontWeight="bold"
                          sx={{ m: "0 0 5px 0" }}
                        >
                          Start/End Time
                        </Typography>
                        <Typography variant="h6">
                          The starting and ending time of the lunch period.
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "40%",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label="Start Time"
                            id="lunchBreakStartTime"
                            name="lunchBreakStartTime"
                            views={["hours", "minutes"]}
                            inputFormat="hh:mm"
                            value={values.lunchBreakStartTime}
                            onChange={(value) => {
                              setFieldValue("lunchBreakStartTime", value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                variant="filled"
                                type="date"
                                label="Start Time"
                                onBlur={handleBlur}
                                name="lunchBreakStartTime"
                                error={
                                  !!touched.lunchBreakStartTime &&
                                  !!errors.lunchBreakStartTime
                                }
                                helperText={
                                  touched.lunchBreakStartTime &&
                                  errors.lunchBreakStartTime
                                }
                                inputProps={{
                                  ...params.inputProps,
                                  placeholder: "hh:mm",
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>

                        <div style={{ width: 30 }} />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label="End Time"
                            id="lunchBreakEndTime"
                            name="lunchBreakEndTime"
                            views={["hours", "minutes"]}
                            inputFormat="hh:mm"
                            value={values.lunchBreakEndTime}
                            onChange={(value) => {
                              setFieldValue("lunchBreakEndTime", value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                variant="filled"
                                type="date"
                                label="End Time"
                                onBlur={handleBlur}
                                name="lunchBreakEndTime"
                                error={
                                  !!touched.lunchBreakEndTime &&
                                  !!errors.lunchBreakEndTime
                                }
                                helperText={
                                  touched.lunchBreakEndTime &&
                                  errors.lunchBreakEndTime
                                }
                                inputProps={{
                                  ...params.inputProps,
                                  placeholder: "hh:mm",
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 20,
                        marginBottom: 40,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "60%",
                          paddingRight: 50,
                        }}
                      >
                        <Typography
                          variant="h5"
                          color={colors.grey[100]}
                          fontWeight="bold"
                          sx={{ m: "0 0 5px 0" }}
                        >
                          Usage Amount
                        </Typography>
                        <Typography variant="h6">
                          The number of times the lunch break option can be used
                          during lunch period.
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "40%",
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          type="number"
                          inputProps={{ min: 0 }}
                          label="Minute(s)"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.lunchBreakUsageAmount}
                          name="lunchBreakUsageAmount"
                          error={
                            !!touched.lunchBreakUsageAmount &&
                            !!errors.lunchBreakUsageAmount
                          }
                          helperText={
                            touched.lunchBreakUsageAmount &&
                            errors.lunchBreakUsageAmount
                          }
                        />
                      </div>
                    </div>

                    <Typography
                      variant="h4"
                      color={colors.grey[100]}
                      fontWeight="bold"
                      sx={{ m: "0 0 20px 0" }}
                    >
                      Dinner Break
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "60%",
                          paddingRight: 50,
                        }}
                      >
                        <Typography
                          variant="h5"
                          color={colors.grey[100]}
                          fontWeight="bold"
                          sx={{ m: "0 0 5px 0" }}
                        >
                          Time Limit
                        </Typography>
                        <Typography variant="h6">
                          The time limit for students to return to their seats
                          after taking a dinner break.
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "40%",
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          type="number"
                          inputProps={{ min: 0 }}
                          label="Minute(s)"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.dinnerBreakTimeLimit}
                          name="dinnerBreakTimeLimit"
                          error={
                            !!touched.dinnerBreakTimeLimit &&
                            !!errors.dinnerBreakTimeLimit
                          }
                          helperText={
                            touched.dinnerBreakTimeLimit &&
                            errors.dinnerBreakTimeLimit
                          }
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 20,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "60%",
                          paddingRight: 50,
                        }}
                      >
                        <Typography
                          variant="h5"
                          color={colors.grey[100]}
                          fontWeight="bold"
                          sx={{ m: "0 0 5px 0" }}
                        >
                          Start/End Time
                        </Typography>
                        <Typography variant="h6">
                          The starting and ending time of the dinner period.
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "40%",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label="Start Time"
                            id="dinnerBreakStartTime"
                            name="dinnerBreakStartTime"
                            views={["hours", "minutes"]}
                            inputFormat="hh:mm"
                            value={values.dinnerBreakStartTime}
                            onChange={(value) => {
                              setFieldValue("dinnerBreakStartTime", value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                variant="filled"
                                type="date"
                                label="Start Time"
                                onBlur={handleBlur}
                                name="dinnerBreakStartTime"
                                error={
                                  !!touched.dinnerBreakStartTime &&
                                  !!errors.dinnerBreakStartTime
                                }
                                helperText={
                                  touched.dinnerBreakStartTime &&
                                  errors.dinnerBreakStartTime
                                }
                                inputProps={{
                                  ...params.inputProps,
                                  placeholder: "hh:mm",
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>

                        <div style={{ width: 30 }} />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label="End Time"
                            id="dinnerBreakEndTime"
                            name="dinnerBreakEndTime"
                            views={["hours", "minutes"]}
                            inputFormat="hh:mm"
                            value={values.dinnerBreakEndTime}
                            onChange={(value) => {
                              setFieldValue("dinnerBreakEndTime", value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                variant="filled"
                                type="date"
                                label="End Time"
                                onBlur={handleBlur}
                                name="dinnerBreakEndTime"
                                error={
                                  !!touched.dinnerBreakEndTime &&
                                  !!errors.dinnerBreakEndTime
                                }
                                helperText={
                                  touched.dinnerBreakEndTime &&
                                  errors.dinnerBreakEndTime
                                }
                                inputProps={{
                                  ...params.inputProps,
                                  placeholder: "hh:mm",
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 20,
                        marginBottom: 40,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "60%",
                          paddingRight: 50,
                        }}
                      >
                        <Typography
                          variant="h5"
                          color={colors.grey[100]}
                          fontWeight="bold"
                          sx={{ m: "0 0 5px 0" }}
                        >
                          Usage Amount
                        </Typography>
                        <Typography variant="h6">
                          The number of times the lunch break option can be used
                          during dinner period.
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "40%",
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          type="number"
                          inputProps={{ min: 0 }}
                          label="Minute(s)"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.dinnerBreakUsageAmount}
                          name="dinnerBreakUsageAmount"
                          error={
                            !!touched.dinnerBreakUsageAmount &&
                            !!errors.dinnerBreakUsageAmount
                          }
                          helperText={
                            touched.dinnerBreakUsageAmount &&
                            errors.dinnerBreakUsageAmount
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* stop reservation */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    borderColor: "#C0C0C0",
                    borderStyle: "solid",
                    borderRadius: 5,
                    borderWidth: 2,
                    paddingTop: 15,
                    paddingBottom: 15,
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: 15,
                    }}
                  >
                    <HourglassTopIcon
                      style={{
                        height: 22,
                        width: 22,
                        marginRight: 10,
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="h5"
                        color={colors.grey[100]}
                        fontWeight="bold"
                        sx={{ m: "0 0 5px 0" }}
                      >
                        Disable Seat Reservation
                      </Typography>

                      <Typography variant="h6">
                        When this is turned on, students will not be able to
                        make seat reservations via the SmartSeat mobile app.
                      </Typography>
                    </div>
                  </div>

                  <div style={{ alignSelf: "center", marginRight: 15 }}>
                    <ColorSwitch checked={false} />
                  </div>
                </div>
              </div>
            </form>
          )}
        </Formik>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 50,
        }}
      >
        <SaveButton variant="contained">Save Changes</SaveButton>
      </div>
      <div style={{ height: 50 }}></div>
    </Box>
  );
};

const editCheckoutSchema = yup.object().shape({
  revCheckInTimeLimit: yup
    .number()
    .typeError("Invalid check-in time limit.")
    .min(0, "Check-in time limit cannot be less than 0 min.")
    .required("Check-in time limit is required."),
  shortBreakTimeLimit: yup
    .number()
    .typeError("Invalid short break time limit.")
    .min(0, "Short break time limit cannot be less than 0 min.")
    .required("Short break time limit is required."),
  shortBreakUsageAmount: yup
    .number()
    .typeError("Invalid short break usage amount.")
    .min(0, "Short break usage amount cannot be less than 0.")
    .required("Short break usage amount is required."),
  lunchBreakTimeLimit: yup
    .number()
    .typeError("Invalid lunch break time limit.")
    .min(0, "Lunch break time limit cannot be less than 0 min.")
    .required("Lunch break time limit is required."),
  lunchBreakStartTime: yup
    .date()
    .typeError("Invalid lunch break start time.")
    .required("Lunch break start time is required."),
  lunchBreakEndTime: yup
    .date()
    .typeError("Invalid lunch break end time.")
    .required("Lunch break end time is required."),
  lunchBreakUsageAmount: yup
    .number()
    .typeError("Invalid lunch break usage amount.")
    .min(0, "Lunch break usage amount cannot be less than 0.")
    .required("Lunch break usage amount is required."),
  dinnerBreakTimeLimit: yup
    .number()
    .typeError("Invalid dinner break time limit.")
    .min(0, "Dinner break time limit cannot be less than 0 min.")
    .required("Dinner break time limit is required."),
  dinnerBreakStartTime: yup
    .date()
    .typeError("Invalid dinner break start time.")
    .required("Dinner break start time is required."),
  dinnerBreakEndTime: yup
    .date()
    .typeError("Invalid dinner break end time.")
    .required("Dinner break end time is required."),
  dinnerBreakUsageAmount: yup
    .number()
    .typeError("Invalid dinner break usage amount.")
    .min(0, "Dinner break usage amount cannot be less than 0.")
    .required("Dinner break usage amount is required."),
  reservationDisabled: yup
    .number()
    .typeError("Invalid reservation state.")
    .required("Reservation state is required."),
});

export default FAQ;
