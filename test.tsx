import { Grid } from "@mui/material";

export function Test1() { return <Grid size={{ xs: 12, md: 5 }} />; }
export function Test2() { return <Grid xs={12} md={5} />; }
export function Test3() { return <Grid size={12} />; }
