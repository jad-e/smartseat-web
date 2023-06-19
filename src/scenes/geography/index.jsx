import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";

import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const GEOGRAPHY = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="LIBRARY" subtitle="Library Insights" />

      <p>floor map</p>
      <p>seat data (table)</p>
    </Box>
  );
};

export default GEOGRAPHY;
